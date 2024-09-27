import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, Edit2, CheckCircle } from 'lucide-react';
import { 
  Button, 
  TextInput,
  DatePicker, 
  DatePickerInput, 
  TextArea, 
  Form,
  Accordion,
  AccordionItem,
  Loading
} from '@carbon/react';

interface RecordingDetailsProps {
  recordingName: string;
  recordingDate: string;
  recordingDuration: string;
  transcript: string;
  audioUrl: string;
  onBack: () => void;
}

const RecordingDetails: React.FC<RecordingDetailsProps> = ({
  recordingName,
  recordingDate,
  recordingDuration,
  transcript,
  audioUrl,
  onBack
}) => {
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [isRunningCommands, setIsRunningCommands] = useState(false);
  const [isTranscriptExpanded, setIsTranscriptExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(recordingName);
  const inputRef = useRef<HTMLInputElement>(null);
  const [loadingForms, setLoadingForms] = useState<string[]>([]);
  const [completedForms, setCompletedForms] = useState<string[]>([]);
  const [allCommandsCompleted, setAllCommandsCompleted] = useState(false);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleRunCommands = async (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsRunningCommands(true);
    setCompletedForms([]);
    
    for (const form of forms) {
      setLoadingForms(prev => [...prev, form.id]);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLoadingForms(prev => prev.filter(id => id !== form.id));
      setCompletedForms(prev => [...prev, form.id]);
    }
    
    setIsRunningCommands(false);
    setAllCommandsCompleted(true);
  };

  const placeholderTranscript = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.`;

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedName(e.target.value);
  };

  const handleNameSubmit = () => {
    setIsEditing(false);
    // Here you would typically update the recording name in your backend
    console.log("New recording name:", editedName);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleNameSubmit();
    }
  };

  const forms = [
    { title: "Add to CRM", id: "crm" },
    { title: "Send Welcome Email", id: "email" },
    { title: "Schedule Follow-up", id: "followup" }
  ];

  const renderFormFields = (form: any, isDisabled: boolean) => (
    <>
      <TextInput
        id={`patientName_${form.id}`}
        labelText="Patient Name"
        placeholder="Enter patient name"
        className="mb-4"
        onClick={(e) => e.stopPropagation()}
        disabled={isDisabled}
      />
      <DatePicker 
        datePickerType="single" 
        className="mb-4"
        onClick={(e) => e.stopPropagation()}
        disabled={isDisabled}
      >
        <DatePickerInput
          id={`dateOfBirth_${form.id}`}
          placeholder="mm/dd/yyyy"
          labelText="Date of Birth"
          style={{ width: '100%' }}
          onClick={(e) => e.stopPropagation()}
          disabled={isDisabled}
        />
      </DatePicker>
      <TextArea
        id={`symptoms_${form.id}`}
        labelText="Symptoms"
        placeholder="Enter patient symptoms"
        rows={4}
        onClick={(e) => e.stopPropagation()}
        disabled={isDisabled}
      />
    </>
  );

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <Button
          kind="ghost"
          onClick={onBack}
          className="hover:font-semibold transition-all duration-200 flex items-center"
        >
          <ChevronLeft size={16} className="mr-2" />
          Back to Recordings
        </Button>
      </div>
      <div className="flex flex-1">
        <div className="w-3/4 pr-8">
          <div className="flex items-center mb-4">
            {isEditing ? (
              <TextInput
                id="recording-name"
                labelText="Recording Name"
                hideLabel
                value={editedName}
                onChange={handleNameChange}
                onBlur={handleNameSubmit}
                onKeyDown={handleKeyDown}
                ref={inputRef}
              />
            ) : (
              <>
                <h2 className="text-2xl font-bold mr-2">{editedName}</h2>
                <Button
                  kind="ghost"
                  renderIcon={(props) => <Edit2 size={16} {...props} />}
                  iconDescription="Edit recording name"
                  hasIconOnly
                  onClick={handleEditClick}
                />
              </>
            )}
          </div>
          <p className="mb-2">Date: {recordingDate}</p>
          <p className="mb-4">Duration: {recordingDuration}</p>
          
          <Accordion className="w-full">
            <AccordionItem
              title="New Patient Intake"
              open={isAccordionOpen}
              onClick={() => setIsAccordionOpen(!isAccordionOpen)}
              className="w-full"
            >
              <div className="w-full p-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-end mb-4">
                  <Button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRunCommands(e);
                    }}
                    disabled={isRunningCommands || allCommandsCompleted}
                  >
                    {isRunningCommands ? (
                      <>
                        <Loading 
                          className="inline-block mr-2" 
                          description="Running Commands" 
                          withOverlay={false} 
                          small
                        />
                        Running Commands
                      </>
                    ) : allCommandsCompleted ? (
                      "All Commands Completed"
                    ) : (
                      `Run (${forms.length}) Commands`
                    )}
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {forms.map((form) => (
                    <Form key={form.id} className="cds--form border-2 border-black p-4 rounded-md relative">
                      <h3 className="text-xl font-semibold mb-4">{form.title}</h3>
                      {loadingForms.includes(form.id) ? (
                        <div className="flex items-center justify-center h-40">
                          <Loading description={`Loading ${form.title}`} withOverlay={false} />
                        </div>
                      ) : completedForms.includes(form.id) ? (
                        <>
                          <div className="flex flex-col items-center justify-center h-20 text-green-500 mb-4">
                            <CheckCircle size={32} />
                            <p className="mt-2">Command Complete</p>
                          </div>
                          {renderFormFields(form, true)}
                        </>
                      ) : (
                        renderFormFields(form, false)
                      )}
                    </Form>
                  ))}
                </div>
              </div>
            </AccordionItem>
          </Accordion>
        </div>
        
        <div className="w-1/4 pl-8 border-l-2 border-gray-300">
          <h3 className="text-xl font-semibold mb-2">Transcript</h3>
          <div className={`bg-gray-100 p-4 rounded-md mb-4 ${isTranscriptExpanded ? 'h-auto' : 'h-64'} overflow-hidden transition-all duration-300 ease-in-out`}>
            <p className={isTranscriptExpanded ? '' : 'line-clamp-[10]'}>{placeholderTranscript}</p>
          </div>
          <span
            className="text-blue-600 hover:underline cursor-pointer mb-8 inline-block"
            onClick={() => setIsTranscriptExpanded(!isTranscriptExpanded)}
          >
            {isTranscriptExpanded ? 'Show Less' : 'Show More'}
          </span>
          
          <h3 className="text-xl font-semibold mb-2 pt-4">Audio Playback</h3>
          <div className="bg-gray-100 p-4 rounded-md">
            <audio controls src={audioUrl} className="w-full">
              Your browser does not support the audio element.
            </audio>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordingDetails;

import React, { useState, useEffect } from 'react';
import {
  FlexGrid,
  Row,
  Column,
  TextInput,
  Select,
  SelectItem,
  Button,
  ButtonSet,
  Accordion,
  AccordionItem,
  Modal
} from '@carbon/react';
import { Trash } from '@carbon/icons-react';

// Define the structure for pre-configured commands
interface CommandConfig {
  type: string;
  arguments: { [key: string]: string };
  prompts: { [key: string]: string };
}

// Pre-configured commands
const commandConfigs: CommandConfig[] = [
  {
    type: 'updateCRMRecord',
    arguments: {
      headerText: '',
      dateOfBirth: '',
      appointmentDate: '',
    },
    prompts: {
      headerText: 'Summarize the transcript and give me a short header',
      dateOfBirth: "Extract any mentions of the customer's age or birth date",
      appointmentDate: 'Identify any discussed future meeting dates or deadlines, formatted in mm/dd/yyyy',
    },
  },
  {
    type: 'scheduleInitialAppointment',
    arguments: {
      appointmentType: '',
      clientAvailability: '',
      specialRequirements: '',
    },
    prompts: {
      appointmentType: 'Identify the type of appointment this is.',
      clientAvailability: "Detect any mentions of the client's preferred times or days for appointments",
      specialRequirements: 'Identify any special needs or accommodations the client may require',
    },
  },
  // Add more pre-configured commands as needed
];

interface Command {
  type: string;
  arguments: { [key: string]: string };
  prompts: { [key: string]: string };
}

interface Action {
  id: string;
  name: string;
  commands: Command[];
}

interface ActionEditorProps {
  action?: Action;
  onSave: (action: Action) => void;
  onCancel: () => void;
  onDelete: (actionId: string) => void;
}

const ActionEditor: React.FC<ActionEditorProps> = ({ action, onSave, onCancel, onDelete }) => {
  const [editedAction, setEditedAction] = useState<Action>({
    id: action?.id || '',
    name: action?.name || '',
    commands: action?.commands || [],
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const addCommand = () => {
    setEditedAction(prev => ({
      ...prev,
      commands: [...prev.commands, { type: '', arguments: {}, prompts: {} }],
    }));
  };

  const updateCommand = (index: number, commandConfig: CommandConfig) => {
    setEditedAction(prev => {
      const newCommands = [...prev.commands];
      newCommands[index] = { ...commandConfig };
      return { ...prev, commands: newCommands };
    });
  };

  const updateArgument = (commandIndex: number, argName: string, value: string) => {
    setEditedAction(prev => {
      const newCommands = [...prev.commands];
      newCommands[commandIndex].arguments = { 
        ...newCommands[commandIndex].arguments, 
        [argName]: value 
      };
      return { ...prev, commands: newCommands };
    });
  };

  const updatePrompt = (commandIndex: number, argName: string, value: string) => {
    setEditedAction(prev => {
      const newCommands = [...prev.commands];
      newCommands[commandIndex].prompts = { 
        ...newCommands[commandIndex].prompts, 
        [argName]: value 
      };
      return { ...prev, commands: newCommands };
    });
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    onDelete(editedAction.id);
    setIsDeleteModalOpen(false);
  };

  return (
    <FlexGrid>
      <Row className="mb-4">
        <Column>
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold">Actions / {editedAction.name || 'New Action'}</h2>
            {action && ( // Only show delete button for existing actions
              <Button kind="danger" renderIcon={Trash} onClick={handleDeleteClick}>Delete Action</Button>
            )}
          </div>
        </Column>
      </Row>

      <Row className="mb-4">
        <Column>
          <TextInput
            id="action-name"
            labelText="Action Name"
            value={editedAction.name}
            onChange={(e) => setEditedAction(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Give your action a descriptive name to easily identify it later."
          />
        </Column>
      </Row>

      <Row className="mb-4">
        <Column>
          <h3 className="text-xl font-semibold mb-2">Add Commands</h3>
          <p className="text-sm text-gray-600 mb-4">Add the Commands you'd like to trigger in this Action</p>
          
          <Accordion>
            {editedAction.commands.map((command, index) => (
              <AccordionItem 
                key={index} 
                title={`Command ${index + 1}: ${command.type || 'Select command type'}`}
              >
                <Select
                  id={`command-type-${index}`}
                  labelText="Command Type"
                  value={command.type}
                  onChange={(e) => {
                    const selectedConfig = commandConfigs.find(c => c.type === e.target.value);
                    if (selectedConfig) {
                      updateCommand(index, selectedConfig);
                    }
                  }}
                >
                  <SelectItem value="" text="Choose a command type" />
                  {commandConfigs.map(config => (
                    <SelectItem key={config.type} value={config.type} text={config.type} />
                  ))}
                </Select>
                
                {command.type && (
                  <div className="mt-4">
                    <h4 className="text-lg font-semibold mb-2">Arguments:</h4>
                    {Object.entries(command.arguments).map(([argName, argValue]) => (
                      <div key={argName} className="mb-4">
                        <TextInput
                          id={`arg-${index}-${argName}`}
                          labelText={argName}
                          value={argValue}
                          onChange={(e) => updateArgument(index, argName, e.target.value)}
                        />
                        <TextInput
                          id={`prompt-${index}-${argName}`}
                          labelText={`Prompt for ${argName}`}
                          value={command.prompts[argName] || ''}
                          readOnly
                        />
                      </div>
                    ))}
                  </div>
                )}
              </AccordionItem>
            ))}
          </Accordion>

          <Button onClick={addCommand} className="mt-4">+ Add Command</Button>
        </Column>
      </Row>

      <Row>
        <Column>
          <ButtonSet>
            <Button kind="secondary" onClick={onCancel}>Cancel</Button>
            <Button onClick={() => onSave(editedAction)}>Save Action</Button>
          </ButtonSet>
        </Column>
      </Row>

      <Modal
        open={isDeleteModalOpen}
        onRequestClose={() => setIsDeleteModalOpen(false)}
        modalHeading="Are you sure you want to delete this action?"
        modalLabel="Delete Action"
        primaryButtonText="Delete"
        secondaryButtonText="Cancel"
        danger
        onSecondarySubmit={() => setIsDeleteModalOpen(false)}
        onRequestSubmit={handleDeleteConfirm}
      >
        <p>This action will be permanently deleted. This cannot be undone.</p>
      </Modal>
    </FlexGrid>
  );
};

export default ActionEditor;

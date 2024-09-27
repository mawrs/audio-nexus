'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import {
  DataTable,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  FlexGrid,
  Row,
  Column,
  MenuItem,
  Modal,
  Pagination
} from '@carbon/react'
import { Mic, Zap, Video, Grid, Phone, Code, Settings as SettingsIcon, Trash2, Building } from 'lucide-react'
import '@carbon/styles/css/styles.css';
import Image from 'next/image';
import logo from '../images/logo.svg';
import Actions from './actions'
import Integrations from './integrations'
import Scripts from './scripts'
import SettingsComponent from './settings'

// Dynamically import ComboButton with SSR disabled
const DynamicComboButton = dynamic(
  () => import('@carbon/react').then((mod) => mod.ComboButton),
  { ssr: false }
)

const DynamicRecordingDetails = dynamic(
  () => import('./recording-details').then(mod => mod.default),
  { 
    ssr: false,
    loading: () => <p>Loading recording details...</p>
  }
);

export function AppLayout() {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingType, setRecordingType] = useState('')
  const [recordingTime, setRecordingTime] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [status, setStatus] = useState('inactive');
  const [description, setDescription] = useState('Deleting...');
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [selectedRecording, setSelectedRecording] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('recordings')

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordingTime(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCountingDown && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (isCountingDown && countdown === 0) {
      setIsCountingDown(false);
      setIsRecording(true);
      setRecordingTime(0);
    }
    return () => clearTimeout(timer);
  }, [isCountingDown, countdown]);

  const startCountdown = (type: string) => {
    setIsCountingDown(true);
    setCountdown(3);
    setRecordingType(type);
  }

  const cancelCountdown = () => {
    setIsCountingDown(false);
    setCountdown(3);
    setRecordingType('');
  }

  const stopRecording = () => {
    setIsRecording(false);
    // Generate a new recording ID (you might want to use a more robust method in production)
    const newRecordingId = Date.now().toString();
    setSelectedRecording(newRecordingId);
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = time % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  const headers = [
    { key: 'name', header: 'Name', isSortable: true },
    { key: 'date', header: 'Date', isSortable: true },
    { key: 'actions', header: '', isSortable: false },
  ]

  const rows = [
    { id: '1', name: "John New Patient Intake", date: "Wed Jul 31 2024, 12:15:42PM", type: "zoom" },
    { id: '2', name: "Johnson Evaluation Review", date: "Thu Aug 1 2024, 09:30:15AM", type: "zoom" },
    { id: '3', name: "Smith Follow-Up Session", date: "Fri Aug 2 2024, 14:45:30PM", type: "meet" },
    { id: '4', name: "Williams Progress Report", date: "Mon Aug 5 2024, 11:00:00AM", type: "zoom" },
    { id: '5', name: "Miller Initial Consultation", date: "Tue Aug 6 2024, 15:20:45PM", type: "zoom" },
    { id: '6', name: "Garcia Rehabilitation Check", date: "Wed Aug 7 2024, 10:10:30AM", type: "phone" },
    { id: '7', name: "Davis Initial Consultation", date: "Thu Aug 8 2024, 13:40:00PM", type: "phone" },
    { id: '8', name: "Brown Discharge Summary", date: "Fri Aug 9 2024, 16:05:20PM", type: "zoom" },
    { id: '9', name: "Jones Treatment Plan", date: "Mon Aug 12 2024, 08:50:10AM", type: "meet" },
    { id: '10', name: "Taylor Therapy Session", date: "Tue Aug 13 2024, 14:30:00PM", type: "zoom" },
    { id: '11', name: "Anderson Medication Review", date: "Wed Aug 14 2024, 11:20:45AM", type: "phone" },
    { id: '12', name: "Thomas Psychological Assessment", date: "Thu Aug 15 2024, 09:15:30AM", type: "meet" },
    { id: '13', name: "Jackson Family Counseling", date: "Fri Aug 16 2024, 15:45:00PM", type: "zoom" },
    { id: '14', name: "White Cognitive Behavioral Therapy", date: "Mon Aug 19 2024, 10:30:15AM", type: "zoom" },
    { id: '15', name: "Harris Substance Abuse Counseling", date: "Tue Aug 20 2024, 13:00:30PM", type: "phone" },
    { id: '16', name: "Martin Grief Counseling", date: "Wed Aug 21 2024, 16:20:00PM", type: "meet" },
    { id: '17', name: "Thompson Couples Therapy", date: "Thu Aug 22 2024, 11:45:45AM", type: "zoom" },
    { id: '18', name: "Garcia Child Psychology Session", date: "Fri Aug 23 2024, 09:00:00AM", type: "zoom" },
    { id: '19', name: "Martinez Eating Disorder Consultation", date: "Mon Aug 26 2024, 14:10:30PM", type: "phone" },
    { id: '20', name: "Robinson PTSD Evaluation", date: "Tue Aug 27 2024, 10:50:15AM", type: "meet" },
    { id: '21', name: "Clark Anxiety Management", date: "Wed Aug 28 2024, 15:30:00PM", type: "zoom" },
    { id: '22', name: "Rodriguez Depression Screening", date: "Thu Aug 29 2024, 11:15:45AM", type: "phone" },
    { id: '23', name: "Lewis Bipolar Disorder Assessment", date: "Fri Aug 30 2024, 13:40:30PM", type: "meet" },
    { id: '24', name: "Lee Schizophrenia Follow-up", date: "Mon Sep 2 2024, 09:20:00AM", type: "zoom" },
    { id: '25', name: "Walker Personality Disorder Evaluation", date: "Tue Sep 3 2024, 16:00:15PM", type: "phone" }
  ]

  const openDeleteModal = (id: string) => {
    setSelectedRowId(id);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false);
    setSelectedRowId(null);
    resetStatus();
  };

  const fakePromise = () => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });
  };

  const submitDelete = async () => {
    setStatus('active');
    await fakePromise();
    setDescription('Deleted!');
    setStatus('finished');
    // Implement your actual delete logic here
    console.log(`Deleted row with id: ${selectedRowId}`);
  };

  const resetStatus = () => {
    setStatus('inactive');
    setDescription('Deleting...');
  };

  const handleRecordingClick = (recordingId: string) => {
    setSelectedRecording(recordingId);
  };

  const handleBackToRecordings = () => {
    setSelectedRecording(null);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'recordings':
        return (
          <FlexGrid fullWidth>
            <Row className="mb-8 items-center">
              <Column sm={4} md={6} lg={8}>
                <div className="flex justify-between items-center">
                  <h2 className="text-3xl font-bold text-[#161616]">Recordings</h2>
                  <DynamicComboButton 
                    label={
                      <div className="flex items-center">
                        <Mic className="mr-2 h-4 w-4" />
                        Start Recording
                      </div>
                    }
                    onClick={() => startCountdown('default')}
                    disabled={isRecording || isCountingDown}
                  >
                    <MenuItem 
                      label="Zoom" 
                      onClick={() => startCountdown('Zoom')}
                      renderIcon={() => <Video className="h-4 w-4 text-[#0f62fe]" />}
                      disabled={isRecording || isCountingDown}
                    />
                    <MenuItem 
                      label="Google Meets" 
                      onClick={() => startCountdown('Google Meets')}
                      renderIcon={() => <Video className="h-4 w-4 text-[#24a148]" />}
                      disabled={isRecording || isCountingDown}
                    />
                    <MenuItem 
                      label="Phone Call" 
                      onClick={() => startCountdown('Phone Call')}
                      renderIcon={() => <Phone className="h-4 w-4 text-[#da1e28]" />}
                      disabled={isRecording || isCountingDown}
                    />
                  </DynamicComboButton>
                </div>
              </Column>
            </Row>

            <Row>
              <Column>
                <DataTable rows={rows} headers={headers}>
                  {({
                    rows,
                    headers,
                    getHeaderProps,
                    getRowProps,
                    getTableProps,
                    getToolbarProps,
                    onInputChange,
                    getTableContainerProps
                  }) => (
                    <TableContainer {...getTableContainerProps()}>
                      <TableToolbar {...getToolbarProps()} aria-label="data table toolbar">
                        <TableToolbarContent>
                          <TableToolbarSearch 
                            onChange={onInputChange} 
                            persistent 
                            placeholder="Search for a recording"
                            className="bg-white"
                          />
                        </TableToolbarContent>
                      </TableToolbar>
                      <Table {...getTableProps()} aria-label="recordings table">
                        <TableHead>
                          <TableRow>
                            {headers.map((header, index) => {
                              const headerProps = getHeaderProps({ header });
                              return (
                                <TableHeader 
                                  key={header.key}
                                  sortDirection={headerProps.sortDirection}
                                  isSortable={index !== headers.length - 1}
                                  onClick={headerProps.onClick}
                                  className={index === headers.length - 1 ? "w-10" : ""}
                                >
                                  {header.header}
                                </TableHeader>
                              );
                            })}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {rows.map(row => (
                            <TableRow key={row.id} {...getRowProps({ row })} className="bg-white">
                              {row.cells.map((cell, index) => (
                                <TableCell key={cell.id} className={index === row.cells.length - 1 ? "p-0 w-10" : ""}>
                                  {index === row.cells.length - 1 ? (
                                    <div className="flex justify-end pr-2">
                                      <button 
                                        onClick={() => openDeleteModal(row.id)}
                                        className="p-1 hover:bg-gray-100 rounded-full"
                                      >
                                        <Trash2 className="h-5 w-5 text-gray-500" />
                                      </button>
                                    </div>
                                  ) : (
                                    <button onClick={() => handleRecordingClick(row.id)}>{cell.value}</button>
                                  )}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </DataTable>

                <Pagination
                  backwardText="Previous page"
                  forwardText="Next page"
                  itemsPerPageText="Items per page:"
                  page={1}
                  pageSize={25}
                  pageSizes={[25, 50, 100, 250]}
                  totalItems={1228}
                  onChange={(data) => console.log('Pagination changed:', data)}
                />
              </Column>
            </Row>
          </FlexGrid>
        )
      case 'actions':
        return <Actions />
      case 'integrations':
        return <Integrations />
      case 'scripts':
        return <Scripts />
      case 'settings':
        return <SettingsComponent />
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col h-screen bg-[#f4f4f4] relative">
      {/* Top navigation */}
      <header className="bg-[#161616] text-white p-4 flex justify-between items-center">
        <div className="flex items-center">
          <Image 
            src={logo}
            alt="Audio Nexus Logo" 
            width={32}
            height={32}
            className="mr-2 h-6 w-auto"
          />
        </div>
        <div className="flex items-center space-x-2 bg-[#393939] px-3 py-2 rounded-md">
          <div className="bg-white p-1 rounded-md">
            <Building className="h-6 w-6 text-black" />
          </div>
          <span className="text-lg">SF Call Center</span>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left-hand navigation */}
        <nav className="w-64 bg-[#f4f4f4] flex flex-col h-full">
          <ul className="space-y-1 p-4">
            <li className={activeTab === 'recordings' ? "bg-[#e0e0e0] rounded-md" : ""}>
              <a href="#" onClick={() => setActiveTab('recordings')} className="flex items-center px-4 py-2 text-[#161616] font-medium">
                <Mic className="h-5 w-5 mr-2" />
                Recordings
              </a>
            </li>
            <li className={activeTab === 'actions' ? "bg-[#e0e0e0] rounded-md" : ""}>
              <a href="#" onClick={() => setActiveTab('actions')} className="flex items-center px-4 py-2 text-[#525252] hover:bg-[#e0e0e0] rounded-md">
                <Zap className="h-5 w-5 mr-2" />
                Actions
              </a>
            </li>
          </ul>
          
          <ul className="space-y-1 p-4 mt-auto">
            <li className={activeTab === 'integrations' ? "bg-[#e0e0e0] rounded-md" : ""}>
              <a href="#" onClick={() => setActiveTab('integrations')} className="flex items-center px-4 py-2 text-[#525252] hover:bg-[#e0e0e0] rounded-md">
                <Grid className="h-5 w-5 mr-2" />
                Integrations
              </a>
            </li>
            <li className={activeTab === 'scripts' ? "bg-[#e0e0e0] rounded-md" : ""}>
              <a href="#" onClick={() => setActiveTab('scripts')} className="flex items-center px-4 py-2 text-[#525252] hover:bg-[#e0e0e0] rounded-md">
                <Code className="h-5 w-5 mr-2" />
                Scripts
              </a>
            </li>
            <li className={activeTab === 'settings' ? "bg-[#e0e0e0] rounded-md" : ""}>
              <a href="#" onClick={() => setActiveTab('settings')} className="flex items-center px-4 py-2 text-[#525252] hover:bg-[#e0e0e0] rounded-md">
                <SettingsIcon className="h-5 w-5 mr-2" />
                Settings
              </a>
            </li>
          </ul>
        </nav>

        {/* Main content */}
        <main className="flex-1 overflow-auto p-8 bg-white">
          {selectedRecording ? (
            <DynamicRecordingDetails
              recordingName={selectedRecording?.name || 'Untitled Recording'}
              recordingDate={selectedRecording?.date || new Date().toLocaleDateString()}
              recordingDuration={selectedRecording?.duration || '00:00'}
              transcript={selectedRecording?.transcript || 'Transcript will be generated soon...'}
              audioUrl={selectedRecording?.audioUrl || ''}
              onBack={handleBackToRecordings}
            />
          ) : (
            renderContent()
          )}
        </main>
      </div>

      {/* Countdown Overlay */}
      {isCountingDown && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="countdown-interface bg-white rounded-lg p-8 shadow-md max-w-md w-full">
            <h3 className="text-2xl font-semibold mb-4 text-center">Recording will start in</h3>
            <div className="flex flex-col items-center justify-center space-y-6">
              <div className="text-6xl font-bold">{countdown}</div>
              <button 
                onClick={cancelCountdown}
                className="bg-red-500 text-white px-6 py-3 rounded-md hover:bg-red-600 transition-colors text-lg font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recording Overlay */}
      {isRecording && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="recording-interface bg-white rounded-lg p-8 shadow-md max-w-md w-full">
            <h3 className="text-2xl font-semibold mb-4 text-center">{recordingType} Recording in Progress</h3>
            <div className="flex flex-col items-center justify-center space-y-6">
              <div className="audio-wave">
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
              </div>
              <div className="text-3xl font-bold">{formatTime(recordingTime)}</div>
              <button 
                onClick={stopRecording}
                className="bg-red-500 text-white px-6 py-3 rounded-md hover:bg-red-600 transition-colors text-lg font-semibold"
              >
                Stop Recording
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        open={isModalOpen}
        onRequestClose={closeDeleteModal}
        danger
        modalHeading="Are you sure you want to delete this recording?"
        modalLabel="Delete Recording"
        primaryButtonText="Delete"
        secondaryButtonText="Cancel"
        onRequestSubmit={submitDelete}
        loadingStatus={status}
        loadingDescription={description}
        onLoadingSuccess={resetStatus}
      />
    </div>
  )
}
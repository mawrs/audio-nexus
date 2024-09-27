import React, { useState } from 'react';
import { 
  Button, 
  ButtonSet, 
  Table, 
  TableHead, 
  TableRow, 
  TableHeader, 
  TableBody, 
  TableCell,
  FlexGrid,
  Row,
  Column
} from '@carbon/react';
import { Add, ArrowRight, Application } from '@carbon/icons-react';
import ActionEditor from './action-editor';

interface Action {
  id: string;
  name: string;
  commands: { command: string; integratedApps: string[] }[];
}

const Actions: React.FC = () => {
  const [actions, setActions] = useState<Action[]>([
    {
      id: '1',
      name: 'New Client Intake',
      commands: [
        { command: 'Add client to CRM', integratedApps: ['Pipedrive', 'HubSpot', 'Salesforce'] },
        { command: 'Schedule initial consultation', integratedApps: ['Calendly', 'Acuity', 'Google Calendar'] },
        { command: 'Send welcome email', integratedApps: ['Gmail', 'Outlook', 'Teams'] },
        { command: 'Update team on new client background', integratedApps: ['Slack', 'Teams', 'Asana'] },
      ],
    },
    {
      id: '2',
      name: 'Offer Process Initiation',
      commands: [
        { command: 'Create offer checklist', integratedApps: ['Notion', 'Dropbox', 'Google Docs'] },
        { command: 'Schedule offer review meeting', integratedApps: ['Calendly', 'Acuity', 'Google Calendar'] },
        { command: 'Request necessary documents from client', integratedApps: ['Gmail', 'Outlook', 'Teams'] },
        { command: 'Notify team of potential offer', integratedApps: ['Slack', 'Teams', 'Asana'] },
      ],
    },
    {
      id: '3',
      name: 'Property Viewing Follow-Up',
      commands: [
        { command: 'Summarize client feedback', integratedApps: ['Otter', 'Fireflies', 'Gong'] },
        { command: 'Schedule offer preparation', integratedApps: ['Calendly', 'Acuity', 'Google Calendar'] },
        { command: 'Send relevant property information', integratedApps: ['Gmail', 'Outlook', 'Teams'] },
        { command: 'Update client preferences in CRM', integratedApps: ['Pipedrive', 'HubSpot', 'Salesforce'] },
      ],
    },
  ]);

  const [editingAction, setEditingAction] = useState<Action | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const renderIntegratedApps = (count: number) => {
    return (
      <div className="flex flex-row items-center">
        {Array(count).fill(0).map((_, index) => (
          <Application key={index} size={20} className="mr-1" />
        ))}
      </div>
    );
  };

  const handleEditAction = (action: Action) => {
    setEditingAction(action);
  };

  const handleCreateAction = () => {
    setIsCreating(true);
  };

  const handleSaveAction = (savedAction: Action) => {
    if (editingAction) {
      setActions(actions.map(a => a.id === savedAction.id ? savedAction : a));
    } else {
      setActions([...actions, { ...savedAction, id: Date.now().toString() }]);
    }
    setEditingAction(null);
    setIsCreating(false);
  };

  const handleCancelEdit = () => {
    setEditingAction(null);
    setIsCreating(false);
  };

  if (editingAction || isCreating) {
    return (
      <ActionEditor 
        action={editingAction || undefined}
        onSave={handleSaveAction}
        onCancel={handleCancelEdit}
      />
    );
  }

  return (
    <FlexGrid fullWidth>
      <Row className="mb-8">
        <Column sm={4} md={6} lg={8}>
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-[#161616]">Actions</h2>
            <ButtonSet className="whitespace-nowrap">
              <Button kind="secondary" className="min-w-max">
                Browse Action Library
              </Button>
              <Button 
                kind="primary" 
                className="min-w-max" 
                renderIcon={(props) => <Add size={20} {...props} />}
                onClick={handleCreateAction}
              >
                Create New Action
              </Button>
            </ButtonSet>
          </div>
        </Column>
      </Row>

      <Row>
        <Column>
          <div className="grid grid-cols-2 gap-6">
            {actions.map((action) => (
              <div 
                key={action.id} 
                className="bg-white shadow-md rounded-lg overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-[#161616] hover:border-2 relative group"
              >
                <div className="flex justify-between items-center bg-gray-100 p-4">
                  <h3 className="text-xl font-semibold">{action.name}</h3>
                  <button 
                    className="text-blue-600 flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    onClick={() => handleEditAction(action)}
                  >
                    Edit <ArrowRight className="ml-1" size={16} />
                  </button>
                </div>
                <Table className="action-table">
                  <TableHead>
                    <TableRow>
                      <TableHeader>Command</TableHeader>
                      <TableHeader>Integrated Apps</TableHeader>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {action.commands.map((command, index) => (
                      <TableRow key={index}>
                        <TableCell>{`${index + 1}. ${command.command}`}</TableCell>
                        <TableCell>{renderIntegratedApps(command.integratedApps.length)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ))}
          </div>
        </Column>
      </Row>
    </FlexGrid>
  );
};

export default Actions;

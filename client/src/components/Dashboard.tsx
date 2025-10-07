import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_USERS, GET_EVENTS, CREATE_EVENT, ADD_USER_TO_EVENT, UPDATE_EVENT } from '../queries';
import { 
  Calendar, 
  Users, 
  TrendingUp, 
  Clock,
  MapPin,
  UserPlus,
  CalendarPlus,
  Activity
} from 'lucide-react';

// TODO: Remplacer par des données GraphQL
interface DashboardStats {
  totalEvents: number;
  totalUsers: number;
  activeEvents: number;
  upcomingEvents: number;
  totalParticipants: number;
  averageParticipation: number;
}

const Dashboard: React.FC = () => {
  // Fetch users and events from GraphQL
  const { data: usersData, loading: usersLoading, error: usersError, refetch: refetchUsers } = useQuery(GET_USERS);
  const { data: eventsData, loading: eventsLoading, error: eventsError, refetch: refetchEvents } = useQuery(GET_EVENTS);

  const users = usersData?.users || [];
  const events = eventsData?.events || [];

  // Compute stats from fetched data
  const totalEvents = events.length;
  const totalUsers = users.length;
  const now = new Date();
  const activeEvents = events.filter((ev: any) => {
    const debut = ev?.date?.debut ? new Date(ev.date.debut) : null;
    const fin = ev?.date?.fin ? new Date(ev.date.fin) : null;
    return debut && fin && debut <= now && now <= fin;
  }).length;
  const upcomingEvents = events.filter((ev: any) => {
    const debut = ev?.date?.debut ? new Date(ev.date.debut) : null;
    return debut && debut > now;
  }).length;
  const totalParticipants = events.reduce((sum: number, ev: any) => sum + (ev.participants ? ev.participants.length : 0), 0);
  const averageParticipation = totalEvents > 0 ? Math.round(totalParticipants / totalEvents) : 0;

  const stats: DashboardStats = {
    totalEvents,
    totalUsers,
    activeEvents,
    upcomingEvents,
    totalParticipants,
    averageParticipation,
  };

  const recentEvents = events
    .slice()
    .sort((a: any, b: any) => {
      const da = a?.date?.debut ? new Date(a.date.debut).getTime() : 0;
      const db = b?.date?.debut ? new Date(b.date.debut).getTime() : 0;
      return da - db;
    })
    .slice(0, 5)
    .map((ev: any) => ({
      id: String(ev.id),
      title: ev.title,
      date: ev?.date?.debut || null,
      participants: ev.participants ? ev.participants.length : 0,
      maxParticipants: ev.maxParticipants || 0,
      status: (() => {
        const debut = ev?.date?.debut ? new Date(ev.date.debut) : null;
        const fin = ev?.date?.fin ? new Date(ev.date.fin) : null;
        if (debut && fin && debut <= now && now <= fin) return 'active';
        if (debut && debut > now) return 'upcoming';
        return 'past';
      })(),
    }));

  const activeUsers = users
    .slice(0, 5)
    .map((u: any) => ({ id: String(u.id), name: u.nom || 'Utilisateur', role: 'Membre', eventsCount: u.organizedEvents ? u.organizedEvents.length : 0 }));

  const StatCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    value: string | number;
    subtitle: string;
    trend?: 'up' | 'down' | 'stable';
  }> = ({ icon, title, value, subtitle, trend = 'stable' }) => (
    <div className="stat-card">
      <div className="stat-icon">
        {icon}
      </div>
      <div className="stat-content">
        <div className="stat-value">{value}</div>
        <div className="stat-title">{title}</div>
        <div className="stat-subtitle">
          {subtitle}
          {trend !== 'stable' && (
            <TrendingUp 
              size={12} 
              className={`trend-icon ${trend === 'up' ? 'trend-up' : 'trend-down'}`}
            />
          )}
        </div>
      </div>
    </div>
  );

  // Quick action state and mutations
  const [showCreateEvent, setShowCreateEvent] = React.useState(false);
  const [showInviteUser, setShowInviteUser] = React.useState(false);
  const [showManageLocation, setShowManageLocation] = React.useState(false);

  // Create event form state
  const [ceTitle, setCeTitle] = React.useState('');
  const [ceDescription, setCeDescription] = React.useState('');
  const [ceDebut, setCeDebut] = React.useState('');
  const [ceFin, setCeFin] = React.useState('');
  const [ceLocation, setCeLocation] = React.useState('');
  const [ceOrganizerId, setCeOrganizerId] = React.useState('');

  // Invite user form state
  const [inviteUserId, setInviteUserId] = React.useState('');
  const [inviteEventId, setInviteEventId] = React.useState('');

  // Manage location form state
  const [mEventId, setMEventId] = React.useState('');
  const [mLocation, setMLocation] = React.useState('');

  const [createEventMutation, { loading: creating }] = useMutation(CREATE_EVENT);
  const [addUserToEventMutation, { loading: inviting }] = useMutation(ADD_USER_TO_EVENT);
  const [updateEventMutation, { loading: updating }] = useMutation(UPDATE_EVENT);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const variables = {
        title: ceTitle,
        description: ceDescription,
        dateRange: { debut: ceDebut, fin: ceFin },
        location: ceLocation,
        organizerId: parseInt(ceOrganizerId, 10) || undefined,
      };
      await createEventMutation({ variables, refetchQueries: [{ query: GET_EVENTS }, { query: GET_USERS }] });
      // reset and close
      setCeTitle(''); setCeDescription(''); setCeDebut(''); setCeFin(''); setCeLocation(''); setCeOrganizerId('');
      setShowCreateEvent(false);
      await refetchEvents();
      await refetchUsers();
    } catch (err) {
      console.error('Create event error', err);
    }
  };

  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const variables = { userId: parseInt(inviteUserId, 10), eventId: parseInt(inviteEventId, 10) };
      await addUserToEventMutation({ variables, refetchQueries: [{ query: GET_EVENTS }, { query: GET_USERS }] });
      setInviteUserId(''); setInviteEventId(''); setShowInviteUser(false);
      await refetchEvents();
      await refetchUsers();
    } catch (err) {
      console.error('Invite error', err);
    }
  };

  const handleUpdateLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const variables = { id: parseInt(mEventId, 10), location: mLocation };
      await updateEventMutation({ variables, refetchQueries: [{ query: GET_EVENTS }] });
      setMEventId(''); setMLocation(''); setShowManageLocation(false);
      await refetchEvents();
    } catch (err) {
      console.error('Update location error', err);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Vue d'ensemble de votre plateforme d'événements</p>
        </div>
        {/* <div className="header-actions">
          <span className="mock-data-indicator">Données factices - TODO: GraphQL</span>
        </div> */}
      </div>

      {/* Statistiques principales */}
      <div className="stats-grid">
        <StatCard
          icon={<Calendar />}
          title="Événements totaux"
          value={stats.totalEvents}
          subtitle="Tous les événements"
          trend="up"
        />
        <StatCard
          icon={<Users />}
          title="Utilisateurs actifs"
          value={stats.totalUsers}
          subtitle="Membres inscrits"
          trend="up"
        />
        <StatCard
          icon={<Activity />}
          title="Événements actifs"
          value={stats.activeEvents}
          subtitle="En cours"
        />
        <StatCard
          icon={<Clock />}
          title="À venir"
          value={stats.upcomingEvents}
          subtitle="Prochains événements"
        />
      </div>

      <div className="dashboard-content">
        {/* Événements récents */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>
              <Calendar size={20} />
              Événements récents
            </h2>
            <button className="btn-secondary">
              Voir tous (TODO: GraphQL)
            </button>
          </div>
          
          <div className="events-summary">
            {recentEvents.map((event: any) => (
              <div key={event.id} className="event-summary-card">
                <div className="event-summary-header">
                  <h3>{event.title}</h3>
                  <span className={`status-badge ${event.status}`}>
                    {event.status === 'upcoming' ? 'À venir' : 'En cours'}
                  </span>
                </div>
                <div className="event-summary-details">
                  <div className="detail-item">
                    <Clock size={14} />
                    {new Date(event.date).toLocaleDateString('fr-FR')}
                  </div>
                  <div className="detail-item">
                    <Users size={14} />
                    {event.participants}/{event.maxParticipants} participants
                  </div>
                </div>
                <div className="participation-bar">
                  <div 
                    className="participation-fill"
                    style={{ width: `${(event.participants / event.maxParticipants) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Utilisateurs actifs */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>
              <Users size={20} />
              Utilisateurs actifs
            </h2>
            <button className="btn-secondary">
              Gérer (TODO: GraphQL)
            </button>
          </div>
          
          <div className="users-summary">
            {activeUsers.map((user: any) => (
              <div key={user.id} className="user-summary-card">
                  <div className="user-summary-avatar">
                  {user.name.split(' ').map((n: string) => n[0]).join('')}
                </div>
                <div className="user-summary-info">
                  <h4>{user.name}</h4>
                  <span className={`role-badge ${user.role.toLowerCase()}`}>
                    {user.role}
                  </span>
                  <p>{user.eventsCount} événements</p>
                </div>
                <div className="user-summary-actions">
                  <button className="btn-icon" disabled title="Voir profil (TODO: GraphQL)">
                    <Users size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="quick-actions">
        <h2>Actions rapides</h2>
        <div className="actions-grid">
          <button className="action-card" onClick={() => setShowCreateEvent(true)}>
            <CalendarPlus size={24} />
            <span>Créer un événement</span>
            <small>Créer rapidement</small>
          </button>
          <button className="action-card" onClick={() => setShowInviteUser(true)}>
            <UserPlus size={24} />
            <span>Inviter des utilisateurs</span>
            <small>Ajouter un participant</small>
          </button>
          <button className="action-card" onClick={() => setShowManageLocation(true)}>
            <MapPin size={24} />
            <span>Gérer les lieux</span>
            <small>Modifier lieu d'un événement</small>
          </button>
          <button className="action-card" disabled>
            <TrendingUp size={24} />
            <span>Voir les analytics</span>
            <small>TODO: GraphQL</small>
          </button>
        </div>
      </div>

      {/* Modals / Forms for quick actions */}
      {showCreateEvent && (
        <div className="modal">
          <form className="modal-content" onSubmit={handleCreateEvent}>
            <h3>Créer un événement</h3>
            <div className="form-row">
              <label>Titre</label>
              <input value={ceTitle} onChange={(e) => setCeTitle(e.target.value)} required />
            </div>
            <div className="form-row">
              <label>Description</label>
              <textarea value={ceDescription} onChange={(e) => setCeDescription(e.target.value)} />
            </div>
            <div className="form-row">
              <label>Date début (ISO)</label>
              <input value={ceDebut} onChange={(e) => setCeDebut(e.target.value)} placeholder="2025-10-15T09:00:00Z" required />
            </div>
            <div className="form-row">
              <label>Date fin (ISO)</label>
              <input value={ceFin} onChange={(e) => setCeFin(e.target.value)} placeholder="2025-10-15T17:00:00Z" required />
            </div>
            <div className="form-row">
              <label>Lieu</label>
              <input value={ceLocation} onChange={(e) => setCeLocation(e.target.value)} required />
            </div>
            <div className="form-row">
              <label>Organisateur</label>
              <select value={ceOrganizerId} onChange={(e) => setCeOrganizerId(e.target.value)} required>
                <option value="">-- choisir --</option>
                {users.map((u: any) => (
                  <option key={u.id} value={u.id}>{u.nom}</option>
                ))}
              </select>
            </div>
            <div className="modal-actions">
              <button type="submit" disabled={creating}>Créer</button>
              <button type="button" onClick={() => setShowCreateEvent(false)}>Annuler</button>
            </div>
          </form>
        </div>
      )}

      {showInviteUser && (
        <div className="modal">
          <form className="modal-content" onSubmit={handleInviteUser}>
            <h3>Inviter un utilisateur</h3>
            <div className="form-row">
              <label>Utilisateur</label>
              <select value={inviteUserId} onChange={(e) => setInviteUserId(e.target.value)} required>
                <option value="">-- choisir --</option>
                {users.map((u: any) => (
                  <option key={u.id} value={u.id}>{u.nom}</option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <label>Événement</label>
              <select value={inviteEventId} onChange={(e) => setInviteEventId(e.target.value)} required>
                <option value="">-- choisir --</option>
                {events.map((ev: any) => (
                  <option key={ev.id} value={ev.id}>{ev.title}</option>
                ))}
              </select>
            </div>
            <div className="modal-actions">
              <button type="submit" disabled={inviting}>Inviter</button>
              <button type="button" onClick={() => setShowInviteUser(false)}>Annuler</button>
            </div>
          </form>
        </div>
      )}

      {showManageLocation && (
        <div className="modal">
          <form className="modal-content" onSubmit={handleUpdateLocation}>
            <h3>Modifier le lieu d'un événement</h3>
            <div className="form-row">
              <label>Événement</label>
              <select value={mEventId} onChange={(e) => setMEventId(e.target.value)} required>
                <option value="">-- choisir --</option>
                {events.map((ev: any) => (
                  <option key={ev.id} value={ev.id}>{ev.title}</option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <label>Nouveau lieu</label>
              <input value={mLocation} onChange={(e) => setMLocation(e.target.value)} required />
            </div>
            <div className="modal-actions">
              <button type="submit" disabled={updating}>Sauvegarder</button>
              <button type="button" onClick={() => setShowManageLocation(false)}>Annuler</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
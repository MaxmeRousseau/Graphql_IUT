import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_USERS, GET_EVENTS } from '../queries';
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
  const { data: usersData, loading: usersLoading, error: usersError } = useQuery(GET_USERS);
  const { data: eventsData, loading: eventsLoading, error: eventsError } = useQuery(GET_EVENTS);

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

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Vue d'ensemble de votre plateforme d'événements</p>
        </div>
        <div className="header-actions">
          <span className="mock-data-indicator">Données factices - TODO: GraphQL</span>
        </div>
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
            <button className="btn-secondary" disabled>
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
            <button className="btn-secondary" disabled>
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
          <button className="action-card" disabled>
            <CalendarPlus size={24} />
            <span>Créer un événement</span>
            <small>TODO: GraphQL</small>
          </button>
          <button className="action-card" disabled>
            <UserPlus size={24} />
            <span>Inviter des utilisateurs</span>
            <small>TODO: GraphQL</small>
          </button>
          <button className="action-card" disabled>
            <MapPin size={24} />
            <span>Gérer les lieux</span>
            <small>TODO: GraphQL</small>
          </button>
          <button className="action-card" disabled>
            <TrendingUp size={24} />
            <span>Voir les analytics</span>
            <small>TODO: GraphQL</small>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
import { gql } from '@apollo/client';

// TODO: Définir vos requêtes GraphQL ici
// Exemple de syntaxe GraphQL pour récupérer des événements avec leurs organisateurs

/* TODO: Décommentez et adaptez cette requête selon votre schéma GraphQL
export const GET_EVENTS = gql`
  query GetEvents {
    events {
      id
      title
      description
      date
      location
      maxParticipants
      currentParticipants
      category
      organizer {
        id
        name
        email
      }
    }
  }
`;
*/

// Authentication mutations used by the client
export const LOGIN = gql`
  mutation Login($nom: String!, $password: String!) {
    login(nom: $nom, password: $password) {
      token
      user {
        id
        nom
        age
      }
      role
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($nom: String!, $age: Int, $password: String!) {
    createUser(nom: $nom, age: $age, password: $password) {
      id
      nom
      age
      createdAt
    }
  }
`;

// Queries that mirror the API Query resolvers
export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      nom
      age
    }
  }
`;

export const GET_USER = gql`
  query GetUser($id: Int!) {
    user(id: $id) {
      id
      nom
      age
      organizedEvents {
        id
        title
      }
      eventsParticipated {
        id
        title
      }
    }
  }
`;

export const GET_EVENTS = gql`
  query GetEvents {
    events {
      id
      title
      description
      date {
        debut
        fin
      }
      location
      organizer {
        id
        nom
      }
      participants {
        id
        nom
      }
    }
  }
`;

export const GET_EVENT_BY_ID = gql`
  query GetEventById($id: Int!) {
    event(id: $id) {
      id
      title
      description
      date {
        debut
        fin
      }
      location
      organizer {
        id
        nom
      }
      participants {
        id
        nom
      }
    }
  }
`;

// Mutations for quick actions
export const CREATE_EVENT = gql`
  mutation CreateEvent($title: String!, $description: String, $dateRange: DateRangeInput!, $location: String!, $organizerId: Int!) {
    createEvent(title: $title, description: $description, dateRange: $dateRange, location: $location, organizerId: $organizerId) {
      id
      title
      description
      date {
        debut
        fin
      }
      location
      organizer {
        id
        nom
      }
      participants {
        id
        nom
      }
    }
  }
`;

export const UPDATE_EVENT = gql`
  mutation UpdateEvent($id: Int!, $title: String, $description: String, $dateRange: DateRangeInput, $location: String) {
    updateEvent(id: $id, title: $title, description: $description, dateRange: $dateRange, location: $location) {
      id
      title
      location
    }
  }
`;

export const ADD_USER_TO_EVENT = gql`
  mutation AddUserToEvent($userId: Int!, $eventId: Int!) {
    addUserToEvent(userId: $userId, eventId: $eventId) {
      id
      title
      participants {
        id
        nom
      }
    }
  }
`;

/* TODO: Décommentez et adaptez cette requête selon votre schéma GraphQL
export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
      role
      eventsOrganized
      eventsAttended
      joinDate
    }
  }
`;
*/

/* TODO: Exemple de requête combinée (optionnel)
export const GET_EVENTS_AND_USERS = gql`
  query GetEventsAndUsers {
    events {
      id
      title
      description
      date
      location
      maxParticipants
      currentParticipants
      category
      organizer {
        id
        name
        email
      }
    }
    users {
      id
      name
      email
      role
      eventsOrganized
      eventsAttended
      joinDate
    }
  }
`;
*/

/* TODO: Requête avec variables et filtres
export const GET_EVENTS_BY_CATEGORY = gql`
  query GetEventsByCategory($category: String!, $limit: Int = 10) {
    events(where: { category: $category }, limit: $limit) {
      id
      title
      date
      location
      currentParticipants
      maxParticipants
      organizer {
        id
        name
      }
    }
  }
`;
*/

/* TODO: Requête pour un événement spécifique par ID
export const GET_EVENT_BY_ID = gql`
  query GetEventById($id: ID!) {
    event(id: $id) {
      id
      title
      description
      date
      location
      maxParticipants
      currentParticipants
      category
      organizer {
        id
        name
        email
      }
      participants {
        id
        name
        email
      }
    }
  }
`;
*/

/* TODO: Requête pour les événements d'un utilisateur
export const GET_USER_EVENTS = gql`
  query GetUserEvents($userId: ID!) {
    user(id: $userId) {
      id
      name
      organizedEvents {
        id
        title
        date
        currentParticipants
        maxParticipants
      }
      attendedEvents {
        id
        title
        date
        organizer {
          name
        }
      }
    }
  }
`;
*/

/* TODO: Mutation pour créer un événement
export const CREATE_EVENT = gql`
  mutation CreateEvent($input: EventInput!) {
    createEvent(input: $input) {
      id
      title
      description
      date
      location
      maxParticipants
      category
      organizer {
        id
        name
      }
    }
  }
`;
*/

/* TODO: Mutation pour modifier un événement
export const UPDATE_EVENT = gql`
  mutation UpdateEvent($id: ID!, $input: EventUpdateInput!) {
    updateEvent(id: $id, input: $input) {
      id
      title
      description
      date
      location
      maxParticipants
      currentParticipants
      category
    }
  }
`;
*/

/* TODO: Mutation pour supprimer un événement
export const DELETE_EVENT = gql`
  mutation DeleteEvent($id: ID!) {
    deleteEvent(id: $id) {
      success
      message
    }
  }
`;
*/

/* TODO: Mutation pour s'inscrire à un événement
export const REGISTER_FOR_EVENT = gql`
  mutation RegisterForEvent($eventId: ID!, $userId: ID!) {
    registerForEvent(eventId: $eventId, userId: $userId) {
      success
      message
      event {
        id
        currentParticipants
        maxParticipants
      }
    }
  }
`;
*/

/* TODO: Subscription pour les mises à jour en temps réel
export const EVENT_UPDATES_SUBSCRIPTION = gql`
  subscription EventUpdates {
    eventUpdated {
      id
      title
      currentParticipants
      maxParticipants
    }
  }
`;
*/

// TODO: Ajoutez d'autres requêtes selon vos besoins :
// - Requêtes avec pagination
// - Requêtes avec recherche textuelle
// - Mutations pour la gestion des utilisateurs
// - Subscriptions pour les notifications en temps réel

/* Exemples de types TypeScript pour vos interfaces GraphQL :

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  maxParticipants: number;
  currentParticipants: number;
  category: string;
  organizer: User;
  participants?: User[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  eventsOrganized: number;
  eventsAttended: number;
  joinDate: string;
  organizedEvents?: Event[];
  attendedEvents?: Event[];
}

export interface EventInput {
  title: string;
  description: string;
  date: string;
  location: string;
  maxParticipants: number;
  category: string;
}

export interface EventUpdateInput {
  title?: string;
  description?: string;
  date?: string;
  location?: string;
  maxParticipants?: number;
  category?: string;
}

*/
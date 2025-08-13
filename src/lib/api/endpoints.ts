// This file defines the API endpoints used in the application.

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export const API_ENDPOINTS = {
  // Member endpoints
  GET_MEMBERS: `${API_BASE_URL}/members`,
  GET_MEMBER_BY_ID: (id: string) => `${API_BASE_URL}/members/${id}`,
  ADD_MEMBER: `${API_BASE_URL}/members`,
  UPDATE_MEMBER: (id: string) => `${API_BASE_URL}/members/${id}`,
  DELETE_MEMBER: (id: string) => `${API_BASE_URL}/members/${id}`,

  // Check-in endpoints
  GET_CHECK_IN_EVENTS: `${API_BASE_URL}/check-in/events`,
  ADD_CHECK_IN_EVENT: `${API_BASE_URL}/check-in/events`,
  UPDATE_CHECK_IN_EVENT: (id: string) => `${API_BASE_URL}/check-in/events/${id}`,
  DELETE_CHECK_IN_EVENT: (id: string) => `${API_BASE_URL}/check-in/events/${id}`,
  UPDATE_CHECK_IN_EVENT_STATUS: (id: string) => `${API_BASE_URL}/check-in/events/${id}/status`,
  SET_CHECK_IN_EVENT_TIMER: (id: string) => `${API_BASE_URL}/check-in/events/${id}/timer`,
};

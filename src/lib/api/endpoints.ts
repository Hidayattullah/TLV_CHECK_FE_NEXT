// This file defines the API endpoints used in the application.

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export const API_ENDPOINTS = {
  // Member endpoints
  GET_MEMBERS: `${API_BASE_URL}/members`,
  GET_MEMBER_BY_ID: (id: string) => `${API_BASE_URL}/members/${id}`,
  ADD_MEMBER: `${API_BASE_URL}/members`,
  UPDATE_MEMBER: (id: string) => `${API_BASE_URL}/members/${id}`,
  DELETE_MEMBER: (id: string) => `${API_BASE_URL}/members/${id}`,

  // ... other endpoints for check-in, prayers, etc.
};

# Chat Application Security Measures

This document outlines the security measures implemented in the chat application to protect user data, prevent unauthorized access, and ensure secure communication.

## Table of Contents

1. [Security Overview](#security-overview)
2. [Authentication and Authorization](#authentication-and-authorization)
3. [Data Protection](#data-protection)
4. [Secure Communication](#secure-communication)
5. [Frontend Security](#frontend-security)
6. [API Security](#api-security)
7. [Vulnerability Prevention](#vulnerability-prevention)
8. [Security Testing](#security-testing)
9. [Compliance and Privacy](#compliance-and-privacy)
10. [Implementation Details](#implementation-details)

## Security Overview

Security is a critical aspect of the chat application, as it handles sensitive user data and private communications. Our security strategy focuses on several key areas:

1. **Authentication**: Ensuring users are who they claim to be
2. **Authorization**: Controlling access to resources and actions
3. **Data Protection**: Securing data at rest and in transit
4. **Secure Communication**: Protecting message content from interception
5. **Frontend Security**: Preventing client-side vulnerabilities
6. **API Security**: Securing the communication between client and server
7. **Vulnerability Prevention**: Proactively addressing potential security issues
8. **Compliance**: Meeting regulatory requirements for data protection

### Security Principles

The application follows these core security principles:

1. **Defense in Depth**: Multiple layers of security controls
2. **Least Privilege**: Users and components have only the permissions they need
3. **Secure by Default**: Security is built into the design, not added later
4. **Fail Securely**: Errors and exceptions don't compromise security
5. **Open Design**: Security doesn't rely on obscurity
6. **Complete Mediation**: All access attempts are verified
7. **Psychological Acceptability**: Security measures are user-friendly
8. **Zero Trust**: Trust is never assumed, always verified

## Authentication and Authorization

The application implements robust authentication and authorization mechanisms:

### Authentication Implementation

```typescript
// Example of authentication implementation
// auth-service.ts
import { jwtDecode } from 'jwt-decode';

interface AuthToken {
  sub: string; // User ID
  name: string;
  email: string;
  roles: string[];
  exp: number; // Expiration timestamp
  iat: number; // Issued at timestamp
}

class AuthService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private user: AuthToken | null = null;
  private refreshPromise: Promise<string> | null = null;
  
  constructor() {
    // Try to load tokens from secure storage
    this.loadTokens();
  }
  
  private loadTokens(): void {
    try {
      // Get tokens from secure storage
      this.accessToken = localStorage.getItem('accessToken');
      this.refreshToken = localStorage.getItem('refreshToken');
      
      // Decode and validate access token
      if (this.accessToken) {
        const decodedToken = jwtDecode<AuthToken>(this.accessToken);
        
        // Check if token is expired
        if (decodedToken.exp * 1000 < Date.now()) {
          // Token is expired, clear it
          this.accessToken = null;
          localStorage.removeItem('accessToken');
        } else {
          // Token is valid, store user info
          this.user = decodedToken;
        }
      }
    } catch (error) {
      console.error('Failed to load auth tokens:', error);
      
      // Clear invalid tokens
      this.clearTokens();
    }
  }
  
  private saveTokens(accessToken: string, refreshToken: string): void {
    // Save tokens to secure storage
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    
    // Update instance variables
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    
    // Decode and store user info
    try {
      this.user = jwtDecode<AuthToken>(accessToken);
    } catch (error) {
      console.error('Failed to decode access token:', error);
      this.clearTokens();
    }
  }
  
  private clearTokens(): void {
    // Clear tokens from secure storage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    // Clear instance variables
    this.accessToken = null;
    this.refreshToken = null;
    this.user = null;
  }
  
  public async login(email: string, password: string): Promise<boolean> {
    try {
      // Send login request to server
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        throw new Error(`Login failed: ${response.statusText}`);
      }
      
      // Parse response
      const { accessToken, refreshToken } = await response.json();
      
      // Save tokens
      this.saveTokens(accessToken, refreshToken);
      
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  }
  
  public logout(): void {
    // Clear tokens
    this.clearTokens();
    
    // Send logout request to server
    fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    }).catch(error => {
      console.error('Logout request failed:', error);
    });
  }
  
  public async getAccessToken(): Promise<string | null> {
    // If we have a valid access token, return it
    if (this.accessToken && this.user) {
      // Check if token is about to expire (within 5 minutes)
      const expiresIn = this.user.exp * 1000 - Date.now();
      
      if (expiresIn > 5 * 60 * 1000) {
        return this.accessToken;
      }
      
      // Token is about to expire, refresh it
      return this.refreshAccessToken();
    }
    
    // No valid access token, try to refresh
    if (this.refreshToken) {
      return this.refreshAccessToken();
    }
    
    // No tokens available
    return null;
  }
  
  private async refreshAccessToken(): Promise<string | null> {
    // If we're already refreshing, return the existing promise
    if (this.refreshPromise) {
      return this.refreshPromise;
    }
    
    // Create a new refresh promise
    this.refreshPromise = new Promise<string>(async (resolve, reject) => {
      try {
        // Send refresh request to server
        const response = await fetch('/api/auth/refresh', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken: this.refreshToken }),
        });
        
        if (!response.ok) {
          throw new Error(`Token refresh failed: ${response.statusText}`);
        }
        
        // Parse response
        const { accessToken, refreshToken } = await response.json();
        
        // Save tokens
        this.saveTokens(accessToken, refreshToken);
        
        resolve(accessToken);
      } catch (error) {
        console.error('Token refresh failed:', error);
        
        // Clear tokens on refresh failure
        this.clearTokens();
        
        reject(error);
      } finally {
        // Clear refresh promise
        this.refreshPromise = null;
      }
    });
    
    return this.refreshPromise;
  }
  
  public isAuthenticated(): boolean {
    return this.user !== null;
  }
  
  public getUserId(): string | null {
    return this.user?.sub || null;
  }
  
  public getUserName(): string | null {
    return this.user?.name || null;
  }
  
  public getUserEmail(): string | null {
    return this.user?.email || null;
  }
  
  public hasRole(role: string): boolean {
    return this.user?.roles.includes(role) || false;
  }
}

// Create a singleton instance
const authService = new AuthService();

export default authService;
```

### Authorization Implementation

```typescript
// Example of authorization implementation
// authorization.ts
import authService from './auth-service';

// Permission types
export enum Permission {
  READ_MESSAGES = 'read:messages',
  SEND_MESSAGES = 'send:messages',
  DELETE_MESSAGES = 'delete:messages',
  CREATE_CONVERSATIONS = 'create:conversations',
  INVITE_USERS = 'invite:users',
  ADMIN_ACCESS = 'admin:access',
}

// Role definitions with associated permissions
export const Roles = {
  USER: [
    Permission.READ_MESSAGES,
    Permission.SEND_MESSAGES,
    Permission.CREATE_CONVERSATIONS,
  ],
  MODERATOR: [
    Permission.READ_MESSAGES,
    Permission.SEND_MESSAGES,
    Permission.DELETE_MESSAGES,
    Permission.CREATE_CONVERSATIONS,
    Permission.INVITE_USERS,
  ],
  ADMIN: [
    Permission.READ_MESSAGES,
    Permission.SEND_MESSAGES,
    Permission.DELETE_MESSAGES,
    Permission.CREATE_CONVERSATIONS,
    Permission.INVITE_USERS,
    Permission.ADMIN_ACCESS,
  ],
};

// Check if user has a specific permission
export function hasPermission(permission: Permission): boolean {
  // If not authenticated, no permissions
  if (!authService.isAuthenticated()) {
    return false;
  }
  
  // Check if user has admin role (which has all permissions)
  if (authService.hasRole('ADMIN')) {
    return true;
  }
  
  // Check if user has moderator role and the permission is included
  if (authService.hasRole('MODERATOR') && Roles.MODERATOR.includes(permission)) {
    return true;
  }
  
  // Check if user has user role and the permission is included
  if (authService.hasRole('USER') && Roles.USER.includes(permission)) {
    return true;
  }
  
  return false;
}

// Authorization HOC for React components
import React, { ComponentType } from 'react';

interface WithAuthorizationProps {
  [key: string]: any;
}

export function withAuthorization(
  WrappedComponent: ComponentType<any>,
  requiredPermission: Permission
) {
  return function WithAuthorization(props: WithAuthorizationProps) {
    // Check if user has required permission
    if (!hasPermission(requiredPermission)) {
      // Render unauthorized component
      return <UnauthorizedComponent />;
    }
    
    // User has permission, render the component
    return <WrappedComponent {...props} />;
  };
}

// Unauthorized component
function UnauthorizedComponent() {
  return (
    <div className="unauthorized">
      <h2>Unauthorized</h2>
      <p>You don't have permission to access this feature.</p>
    </div>
  );
}

// Usage in components
// admin-panel.tsx
import React from 'react';
import { withAuthorization, Permission } from './authorization';

const AdminPanel: React.FC = () => {
  return (
    <div className="admin-panel">
      <h1>Admin Panel</h1>
      {/* Admin panel content */}
    </div>
  );
};

// Export with authorization check
export default withAuthorization(AdminPanel, Permission.ADMIN_ACCESS);
```

## Data Protection

The application implements various measures to protect user data:

### Encryption at Rest

```typescript
// Example of client-side encryption for sensitive data
// encryption-service.ts
import CryptoJS from 'crypto-js';

class EncryptionService {
  private encryptionKey: string | null = null;
  
  public async initialize(userPassword: string): Promise<void> {
    // Derive encryption key from user password
    this.encryptionKey = await this.deriveKey(userPassword);
  }
  
  private async deriveKey(password: string): Promise<string> {
    // Use PBKDF2 to derive a key from the password
    const salt = 'chat-app-salt'; // In a real app, this would be unique per user
    const iterations = 10000;
    const keySize = 256 / 32; // 256 bits
    
    return CryptoJS.PBKDF2(password, salt, {
      keySize,
      iterations,
    }).toString();
  }
  
  public encrypt(data: string): string {
    if (!this.encryptionKey) {
      throw new Error('Encryption service not initialized');
    }
    
    // Encrypt data using AES
    return CryptoJS.AES.encrypt(data, this.encryptionKey).toString();
  }
  
  public decrypt(encryptedData: string): string {
    if (!this.encryptionKey) {
      throw new Error('Encryption service not initialized');
    }
    
    // Decrypt data using AES
    const bytes = CryptoJS.AES.decrypt(encryptedData, this.encryptionKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
  
  public encryptObject(obj: any): string {
    // Convert object to JSON string
    const jsonString = JSON.stringify(obj);
    
    // Encrypt the JSON string
    return this.encrypt(jsonString);
  }
  
  public decryptObject<T>(encryptedData: string): T {
    // Decrypt the data
    const jsonString = this.decrypt(encryptedData);
    
    // Parse the JSON string
    return JSON.parse(jsonString) as T;
  }
  
  public clear(): void {
    // Clear encryption key
    this.encryptionKey = null;
  }
}

// Create a singleton instance
const encryptionService = new EncryptionService();

export default encryptionService;
```

### Secure Storage

```typescript
// Example of secure storage implementation
// secure-storage.ts
import encryptionService from './encryption-service';

class SecureStorage {
  private isInitialized: boolean = false;
  
  public async initialize(password: string): Promise<void> {
    // Initialize encryption service
    await encryptionService.initialize(password);
    this.isInitialized = true;
  }
  
  public setItem(key: string, value: any): void {
    if (!this.isInitialized) {
      throw new Error('Secure storage not initialized');
    }
    
    try {
      // Encrypt the value
      const encryptedValue = encryptionService.encryptObject(value);
      
      // Store in localStorage with a prefix
      localStorage.setItem(`secure_${key}`, encryptedValue);
    } catch (error) {
      console.error(`Failed to securely store item ${key}:`, error);
      throw error;
    }
  }
  
  public getItem<T>(key: string): T | null {
    if (!this.isInitialized) {
      throw new Error('Secure storage not initialized');
    }
    
    try {
      // Get encrypted value from localStorage
      const encryptedValue = localStorage.getItem(`secure_${key}`);
      
      if (!encryptedValue) {
        return null;
      }
      
      // Decrypt the value
      return encryptionService.decryptObject<T>(encryptedValue);
    } catch (error) {
      console.error(`Failed to retrieve secure item ${key}:`, error);
      return null;
    }
  }
  
  public removeItem(key: string): void {
    // Remove item from localStorage
    localStorage.removeItem(`secure_${key}`);
  }
  
  public clear(): void {
    // Clear all secure items from localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      
      if (key && key.startsWith('secure_')) {
        localStorage.removeItem(key);
      }
    }
    
    // Clear encryption service
    encryptionService.clear();
    this.isInitialized = false;
  }
}

// Create a singleton instance
const secureStorage = new SecureStorage();

export default secureStorage;
```

## Secure Communication

The application ensures secure communication between clients and the server:

### End-to-End Encryption

```typescript
// Example of end-to-end encryption for messages
// e2ee-service.ts
import { generateKeyPair, exportKey, importKey, encrypt, decrypt } from './crypto-utils';

interface KeyPair {
  publicKey: CryptoKey;
  privateKey: CryptoKey;
}

interface ExportedKeyPair {
  publicKey: string;
  privateKey: string;
}

class E2EEService {
  private keyPair: KeyPair | null = null;
  private peerPublicKeys: Map<string, CryptoKey> = new Map();
  
  public async initialize(): Promise<string> {
    // Generate a new key pair
    this.keyPair = await generateKeyPair();
    
    // Export public key for sharing
    const exportedPublicKey = await exportKey(this.keyPair.publicKey);
    
    return exportedPublicKey;
  }
  
  public async importKeyPair(exportedKeyPair: ExportedKeyPair): Promise<void> {
    // Import key pair
    this.keyPair = {
      publicKey: await importKey(exportedKeyPair.publicKey, 'public'),
      privateKey: await importKey(exportedKeyPair.privateKey, 'private'),
    };
  }
  
  public async exportKeyPair(): Promise<ExportedKeyPair> {
    if (!this.keyPair) {
      throw new Error('E2EE service not initialized');
    }
    
    // Export key pair
    return {
      publicKey: await exportKey(this.keyPair.publicKey),
      privateKey: await exportKey(this.keyPair.privateKey),
    };
  }
  
  public async addPeerPublicKey(userId: string, publicKeyString: string): Promise<void> {
    // Import peer's public key
    const publicKey = await importKey(publicKeyString, 'public');
    
    // Store the public key
    this.peerPublicKeys.set(userId, publicKey);
  }
  
  public async encryptMessage(userId: string, message: string): Promise<string> {
    if (!this.keyPair) {
      throw new Error('E2EE service not initialized');
    }
    
    // Get peer's public key
    const peerPublicKey = this.peerPublicKeys.get(userId);
    
    if (!peerPublicKey) {
      throw new Error(`Public key not found for user ${userId}`);
    }
    
    // Encrypt message with peer's public key
    return encrypt(message, peerPublicKey);
  }
  
  public async decryptMessage(encryptedMessage: string): Promise<string> {
    if (!this.keyPair) {
      throw new Error('E2EE service not initialized');
    }
    
    // Decrypt message with our private key
    return decrypt(encryptedMessage, this.keyPair.privateKey);
  }
  
  public clear(): void {
    // Clear keys
    this.keyPair = null;
    this.peerPublicKeys.clear();
  }
}

// Create a singleton instance
const e2eeService = new E2EEService();

export default e2eeService;

// crypto-utils.ts (simplified for example)
export async function generateKeyPair(): Promise<KeyPair> {
  // Generate RSA key pair
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: 2048,
      publicExponent: new Uint8Array([0x01, 0x00, 0x01]), // 65537
      hash: 'SHA-256',
    },
    true, // extractable
    ['encrypt', 'decrypt'] // key usages
  );
  
  return {
    publicKey: keyPair.publicKey,
    privateKey: keyPair.privateKey,
  };
}

export async function exportKey(key: CryptoKey): Promise<string> {
  // Export key to JWK format
  const jwk = await window.crypto.subtle.exportKey('jwk', key);
  
  // Convert JWK to string
  return JSON.stringify(jwk);
}

export async function importKey(keyString: string, type: 'public' | 'private'): Promise<CryptoKey> {
  // Parse JWK from string
  const jwk = JSON.parse(keyString);
  
  // Import key from JWK
  return window.crypto.subtle.importKey(
    'jwk',
    jwk,
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256',
    },
    true, // extractable
    type === 'public' ? ['encrypt'] : ['decrypt'] // key usages
  );
}

export async function encrypt(message: string, publicKey: CryptoKey): Promise<string> {
  // Convert message to bytes
  const messageBytes = new TextEncoder().encode(message);
  
  // Encrypt message
  const encryptedBytes = await window.crypto.subtle.encrypt(
    {
      name: 'RSA-OAEP',
    },
    publicKey,
    messageBytes
  );
  
  // Convert encrypted bytes to base64 string
  return btoa(String.fromCharCode(...new Uint8Array(encryptedBytes)));
}

export async function decrypt(encryptedMessage: string, privateKey: CryptoKey): Promise<string> {
  // Convert base64 string to bytes
  const encryptedBytes = Uint8Array.from(atob(encryptedMessage), c => c.charCodeAt(0));
  
  // Decrypt message
  const decryptedBytes = await window.crypto.subtle.decrypt(
    {
      name: 'RSA-OAEP',
    },
    privateKey,
    encryptedBytes
  );
  
  // Convert decrypted bytes to string
  return new TextDecoder().decode(decryptedBytes);
}
```

### Secure WebSocket

```typescript
// Example of secure WebSocket implementation
// secure-websocket.ts
import authService from './auth-service';
import e2eeService from './e2ee-service';

class SecureWebSocket {
  private socket: WebSocket | null = null;
  private url: string;
  private listeners: Map<string, Set<Function>> = new Map();
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 10;
  private reconnectDelay: number = 1000;
  private heartbeatInterval: number | null = null;
  
  constructor(url: string) {
    this.url = url;
  }
  
  public async connect(): Promise<void> {
    // Get access token
    const accessToken = await authService.getAccessToken();
    
    if (!accessToken) {
      throw new Error('Not authenticated');
    }
    
    // Close existing connection
    this.close();
    
    // Create new WebSocket connection with authentication
    this.socket = new WebSocket(`${this.url}?token=${accessToken}`);
    
    // Set up event listeners
    this.socket.onopen = this.handleOpen.bind(this);
    this.socket.onclose = this.handleClose.bind(this);
    this.socket.onerror = this.handleError.bind(this);
    this.socket.onmessage = this.handleMessage.bind(this);
    
    // Wait for connection to open
    await new Promise<void>((resolve, reject) => {
      const onOpen = () => {
        this.socket?.removeEventListener('open', onOpen);
        resolve();
      };
      
      const onError = (error: Event) => {
        this.socket?.removeEventListener('error', onError);
        reject(error);
      };
      
      this.socket?.addEventListener('open', onOpen);
      this.socket?.addEventListener('error', onError);
    });
    
    // Start heartbeat
    this.startHeartbeat();
  }
  
  private handleOpen(event: Event): void {
    console.log('WebSocket connection opened');
    
    // Reset reconnect attempts
    this.reconnectAttempts = 0;
    
    // Notify listeners
    this.emit('open', event);
  }
  
  private handleClose(event: CloseEvent): void {
    console.log('WebSocket connection closed:', event.code, event.reason);
    
    // Stop heartbeat
    this.stopHeartbeat();
    
    // Attempt to reconnect if not a clean close
    if (event.code !== 1000) {
      this.attemptReconnect();
    }
    
    // Notify listeners
    this.emit('close', event);
  }
  
  private handleError(event: Event): void {
    console.error('WebSocket error:', event);
    
    // Notify listeners
    this.emit('error', event);
  }
  
  private async handleMessage(event: MessageEvent): Promise<void> {
    try {
      // Parse message
      const message = JSON.parse(event.data);
      
      // Handle different message types
      switch (message.type) {
        case 'pong':
          // Heartbeat response
          this.emit('heartbeat');
          break;
        
        case 'message':
          // Decrypt message if it's encrypted
          if (message.encrypted) {
            message.content = await e2eeService.decryptMessage(message.content);
          }
          
          // Notify listeners
          this.emit('message', message);
          break;
        
        default:
          // Pass through other message types
          this.emit(message.type, message);
          break;
      }
    } catch (error) {
      console.error('Error handling WebSocket message:', error);
    }
  }
  
  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Maximum reconnect attempts reached');
      this.emit('reconnect_failed');
      return;
    }
    
    this.reconnectAttempts++;
    
    const delay = this.reconnectDelay * Math.pow(1.5, this.reconnectAttempts - 1);
    
    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    setTimeout(() => {
      this.connect().catch(error => {
        console.error('Reconnect failed:', error);
      });
    }, delay);
    
    // Notify listeners
    this.emit('reconnecting', this.reconnectAttempts);
  }
  
  private startHeartbeat(): void {
    this.stopHeartbeat();
    
    this.heartbeatInterval = window.setInterval(() => {
      this.send({ type: 'ping' });
    }, 30000); // 30 seconds
  }
  
  private stopHeartbeat(): void {
    if (this.heartbeatInterval !== null) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }
  
  public async send(data: any): Promise<void> {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket not connected');
    }
    
    // If message is to a specific user and has content, encrypt it
    if (data.type === 'message' && data.recipientId && data.content) {
      data.encrypted = true;
      data.content = await e2eeService.encryptMessage(data.recipientId, data.content);
    }
    
    // Send data
    this.socket.send(JSON.stringify(data));
  }
  
  public on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    
    this.listeners.get(event)?.add(callback);
  }
  
  public off(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      return;
    }
    
    this.listeners.get(event)?.delete(callback);
  }
  
  private emit(event: string, ...args: any[]): void {
    if (!this.listeners.has(event)) {
      return;
    }
    
    for (const callback of this.listeners.get(event) || []) {
      try {
        callback(...args);
      } catch (error) {
        console.error(`Error in ${event} listener:`, error);
      }
    }
  }
  
  public close(): void {
    if (this.socket) {
      // Stop heartbeat
      this.stopHeartbeat();
      
      // Close connection
      this.socket.close(1000, 'Normal closure');
      this.socket = null;
    }
  }
}

// Create a singleton instance
const secureWebSocket = new SecureWebSocket('wss://chat-api.example.com/ws');

export default secureWebSocket;
```

## Frontend Security

The application implements various frontend security measures:

### Content Security Policy

```html
<!-- Example of Content Security Policy implementation -->
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Chat Application</title>
  
  <!-- Content Security Policy -->
  <meta http-equiv="Content-Security-Policy" content="
    default-src 'self';
    script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    font-src 'self' https://fonts.gstatic.com;
    img-src 'self' data: https://storage.example.com;
    connect-src 'self' https://api.example.com wss://chat-api.example.com;
    frame-src 'none';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  ">
  
  <!-- Other head elements -->
</head>
<body>
  <div id="root"></div>
  <!-- Scripts -->
</body>
</html>
```

### XSS Prevention

```typescript
// Example of XSS prevention
// sanitize.ts
import DOMPurify from 'dompurify';

// Configure DOMPurify
DOMPurify.setConfig({
  ALLOWED_TAGS: [
    'b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li',
    'code', 'pre', 'span', 'img',
  ],
  ALLOWED_ATTR: [
    'href', 'target', 'rel', 'src', 'alt', 'class', 'style',
  ],
  ALLOW_DATA_ATTR: false,
  ADD_ATTR: ['target'], // For links
  ADD_TAGS: [], // No additional tags
  FORBID_TAGS: ['script', 'style',

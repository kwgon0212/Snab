# Privacy Policy

**Snab - Tab Management**

Last Updated: November 05, 2025

## 1. Privacy Policy Overview

Snab - Tab Management (hereinafter "this Extension") is a productivity tool that helps users efficiently manage their browser tabs. This Extension prioritizes user privacy protection and collects and processes only the minimum necessary information.

This Extension stores all data only on the user's local browser and does not transmit any data to external servers.

## 2. Information We Collect

### 2.1 Automatically Collected Information

This Extension automatically collects the following information to provide tab management functionality:

- **Tab Information**: Title, URL, and favicon of currently open tabs
- **Browser Window Information**: Number and structure of open windows
- **User Settings**: Snapshot options and workspace settings

### 2.2 Stored Information

The following information is stored only in the user's browser local storage (Chrome Storage):

- **Workspace Data**: Workspaces, groups, and tab information created by users
- **Settings Information**: Extension usage settings such as snapshot options

**Important**: All data is stored only on the user's local browser and is not transmitted to external servers.

## 3. Purpose of Information Collection and Use

### 3.1 Collection Purpose

- Providing tab management functionality
- Creating and managing workspaces and tab groups
- Saving and restoring user settings

### 3.2 Usage Purpose

- Categorizing currently open tabs by workspaces and groups
- Saving current browser state through tab snapshots
- Restoring saved tab groups to new windows
- Providing personalized tab management environment

## 4. Information Processing Methods

### 4.1 Local Processing

- **All data is stored only in the user's browser local storage**
- **No data is transmitted to external servers**
- **No cloud synchronization functionality is provided**
- **All features can be used without an internet connection**

### 4.2 Data Encryption

- Utilizes browser's default security features
- Uses Chrome Storage API's default security mechanisms
- Sensitive information is not separately encrypted (only local storage is performed)

## 5. Information Sharing and Disclosure

### 5.1 No Third-Party Sharing

This Extension does not share collected information with any third parties, including:

- Other service providers
- Advertising networks
- Analytics services
- Data brokers

### 5.2 External Service Integration

- No integration with external services is provided
- All functionality operates locally only
- No external API calls are made

## 6. User Rights

### 6.1 Data Access Rights

- Users can access stored data at any time
- Stored data can be viewed through browser developer tools (Chrome DevTools)
- Backup files can be created through data export functionality

### 6.2 Data Deletion Rights

- All data is deleted when the extension is removed
- Individual workspaces can be deleted
- Extension data can be manually deleted through browser settings

### 6.3 Data Export/Import

- Backup files (JSON) can be created through data export functionality
- Data can be restored in other environments using backup files
- All data is stored only on the user's local device

## 7. Cookies and Tracking Technologies

### 7.1 Cookie Usage

This Extension does not use cookies.

### 7.2 Tracking Technologies

- User behavior is not tracked
- No analytics tools (such as Google Analytics) are used
- No advertising tracking is performed
- No user identifiers are created

## 8. Security Measures

### 8.1 Technical Security

- Utilizes browser's default security features
- Local storage access is restricted to the extension only
- Runs in Chrome's sandbox environment

### 8.2 Administrative Security

- Requests only the minimum necessary permissions (tabs, storage)
- Does not collect unnecessary data
- Clearly states the purpose of data collection and use

## 9. Permission Request Reasons

### 9.1 tabs Permission

**Purpose of Use:**

- Required to read information about currently open tabs
- Required to create new tabs and restore existing tabs
- Required to move tabs to workspaces or to other windows
- Required to detect tab events (create/remove/update) and update UI in real-time

**Usage Locations:**

- `src/utils/windows.ts`: Tab information queries
- `src/newtab/App.tsx`: Tab creation, deletion, and movement
- `src/newtab/components/ui/Tab.tsx`: Tab deletion
- `src/newtab/components/pannel/workspace/GroupCard.tsx`: Restore tabs from groups
- `src/newtab/hooks/useAllWindows.tsx`: Tab event listeners

### 9.2 storage Permission

**Purpose of Use:**

- Required to save user settings and workspace data
- Required to maintain settings after browser restart
- Required to provide data backup and restore functionality

**Usage Locations:**

- `src/newtab/store/workspace.ts`: Workspace data storage/loading
- `src/utils/dataExport.ts`: Data export/import
- `src/newtab/components/header/index.tsx`: Settings storage

**Important**: This permission is used only for local storage and is not used to transmit data to external servers.

## 10. Children's Privacy

This Extension is not directed to children under the age of 13 and does not knowingly collect personal information from children.

## 11. Privacy Policy Changes

### 11.1 Change Notification

When this Privacy Policy is changed, users will be notified through one or more of the following methods:

- Announcement of changes during extension updates
- Posting changes on GitHub repository
- Email notification (in case of significant changes)

### 11.2 Effective Date

Changed Privacy Policy takes effect from the time of extension update.

## 12. Contact Information

If you have any questions about this Privacy Policy or requests regarding personal information, please contact us at:

- **Email**: [kwgon0102@gmail.com](mailto:kwgon0102@gmail.com)
- **GitHub**: https://github.com/kwgon0212/snab

We will respond to personal information-related requests as quickly as possible.

## 13. Supplementary Provisions

This Privacy Policy takes effect from November 05, 2025.

---

**Snab - Tab Management**

Providing a new experience in tab management.

**Privacy Commitment:**

This Extension prioritizes user privacy. All data is stored locally only and is not transmitted to external servers.

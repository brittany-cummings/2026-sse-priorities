/**
 * Coda API Configuration
 * 
 * ⚠️ INTERNAL USE ONLY ⚠️
 * This token is visible in browser DevTools. 
 * Only share this app with trusted internal team members.
 * If sharing externally, use a backend proxy to protect the token.
 * 
 * Token owner: Brittany Cummings
 * Token can be revoked at: https://coda.io/account
 * 
 * @mitigates SSEPriorities:Config against credential_exposure with separate config file
 * @accepts #api_token_exposure to SSEPriorities:Config with internal-only audience (~10 users)
 */

const CODA_CONFIG = {
    // Your Coda API token - get it from https://coda.io/account
    API_TOKEN: 'd93bd64e-9eb4-452f-93ee-4a7d6305a5ef',
    
    // Document ID from your Coda URL
    // URL format: https://coda.io/d/[DOC_ID]/...
    DOC_ID: 'mOBDFwqcOH',
    
    // Table name or ID
    TABLE_ID: 'grid-MPd10aP-U2',
    
    // API Base URL
    BASE_URL: 'https://coda.io/apis/v1'
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CODA_CONFIG;
}


// mocks.ts - Comprehensive mock data for development and testing

// Mock Indicators
const mockIndicators = [  
    { id: 1, name: 'Revenue Growth', value: 15 },  
    { id: 2, name: 'Net Profit Margin', value: 20 },  
    { id: 3, name: 'Customer Retention Rate', value: 75 },
];

// KPIs
const mockKPIs = [  
    { id: 1, name: 'Monthly Active Users', value: 5000 },  
    { id: 2, name: 'Churn Rate', value: 5 },  
    { id: 3, name: 'Sales Conversion Rate', value: 10 },
];

// Glossary Terms
const glossaryTerms = {  
    'KPI': 'Key Performance Indicator',  
    'Revenue': 'Income generated from normal business operations',  
    'Churn': 'The percentage of subscribers who cancel their subscriptions',
};

// Contact Forms
const mockContactForms = [  
    { name: 'John Doe', email: 'john@example.com', message: 'Hello, I need help!' },  
    { name: 'Jane Smith', email: 'jane@example.com', message: 'Can I get a call back?' },
];

// Users
const mockUsers = [  
    { id: 1, username: 'user1', email: 'user1@example.com', role: 'admin' },  
    { id: 2, username: 'user2', email: 'user2@example.com', role: 'user' },  
];

// Helper Functions
function getMockIndicatorById(id) {  
    return mockIndicators.find(indicator => indicator.id === id);  
}

function getMockUserById(id) {  
    return mockUsers.find(user => user.id === id);  
}

export { mockIndicators, mockKPIs, glossaryTerms, mockContactForms, mockUsers, getMockIndicatorById, getMockUserById };
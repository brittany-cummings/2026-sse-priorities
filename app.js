/**
 * SS&E Technology Timeline 2026
 * Simplified presentation-focused app
 * 
 * @mitigates SSEPriorities:App against XSS with textContent for user data
 * @connects SSEPriorities:App to Coda:API with HTTPS REST calls
 */

// ===== Constants =====
const CUTOFF_DATE = new Date('2026-01-01');
const YEAR_START = new Date('2026-01-01');
const YEAR_END = new Date('2026-06-30'); // Q2 end

// Priority order and labels
const PRIORITY_CONFIG = {
    '1': { key: 'primary', label: 'Primary', order: 1 },
    '2': { key: 'secondary', label: 'Secondary', order: 2 },
    '3': { key: 'considering', label: 'Considering', order: 3 },
    '4': { key: 'ongoing', label: 'Ongoing', order: 4 },
    '5': { key: 'ongoing', label: 'As Needed', order: 5 }
};

// Tab configurations
const TAB_CONFIG = {
    technology: { function: 'Technology', owner: 'Lisa' },
    strategy: { function: 'Strategy', owner: 'Kate' },
    content: { function: 'Content', owner: 'Olivia' },
    training: { function: 'Training', owner: ['Jamie', 'Cindy', 'Nick'] },
    gpxpress: { function: 'GPXpress', owner: ['Olga', 'Isabella', 'Angela'] }
};

let currentTab = 'summary';
let allData = [];

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', init);

async function init() {
    try {
        allData = await fetchAllData();
        switchTab(currentTab); // Use switchTab to properly show/hide sections
        hideLoading();
    } catch (error) {
        console.error('Error loading data:', error);
        showError(error.message);
    }
}

/**
 * Switch between tabs
 */
function switchTab(tab) {
    currentTab = tab;
    
    // Update tab buttons
    document.querySelectorAll('.tab').forEach(t => {
        t.classList.toggle('active', t.dataset.tab === tab);
    });
    
    // Hide/show timeline content area
    const timelineContent = document.getElementById('timelineContent');
    if (timelineContent) {
        if (tab === 'gpxpress-summary' || tab === 'summary') {
            timelineContent.classList.add('hidden');
        } else {
            timelineContent.classList.remove('hidden');
        }
    }
    
    // Hide/show L&D summary section if it exists
    document.querySelectorAll('.ld-summary').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Update info sections
    document.querySelectorAll('.info-sections').forEach(section => {
        section.classList.add('hidden');
    });
    document.querySelectorAll('.gpxpress-summary').forEach(section => {
        section.classList.add('hidden');
    });
    document.querySelectorAll('.priorities-summary').forEach(section => {
        section.classList.add('hidden');
    });
    const infoSection = document.getElementById(`info-${tab}`);
    if (infoSection) {
        infoSection.classList.remove('hidden');
    }
    
    renderCurrentTab();
    
    // Initialize accordion for summary tab
    if (tab === 'summary') {
        initAccordion();
    }
}

/**
 * Initialize accordion functionality for Summary tab
 * @mitigates App:Summary against unauthorized_modification with read-only toggle behavior
 */
function initAccordion() {
    document.querySelectorAll('.accordion-header').forEach(header => {
        // Remove existing listeners to prevent duplicates
        header.replaceWith(header.cloneNode(true));
    });
    
    // Re-attach listeners to fresh elements
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            item.classList.toggle('expanded');
        });
    });
}

/**
 * Static items to inject into specific tabs
 * @type {Object}
 */
const STATIC_ITEMS = {
    // Salesforce AI Support - Technology tab (Lisa)
    salesforceAITech: {
        project: 'Salesforce AI Support',
        status: 'In Progress',
        priority: '1. Primary',
        notes: '',
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-06-30'),
        capability: ['All PRO Sales'],
        owner: 'Lisa',
        isStatic: true
    },
    // Salesforce AI Support - Strategy tab (Kate)
    salesforceAIStrategy: {
        project: 'Salesforce AI Support',
        status: 'In Progress',
        priority: '1. Primary',
        notes: '',
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-06-30'),
        capability: ['All PRO Sales'],
        owner: 'Kate',
        isStatic: true
    },
    // As Needed Empower Guides - appears in Training Supervisor section
    asNeededEmpowerGuides: {
        project: 'As Needed Empower Guides',
        status: 'In Progress',
        priority: '4. Ongoing',
        notes: 'Empower Guides & Tools developed as needed to support relevant trainings launched to individual contributors',
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-06-30'),
        capability: [],
        audience: 'Supervisor',
        isStatic: true
    },
    // Strategic Selling - appears in Training Considering section
    strategicSelling: {
        project: 'Strategic Selling',
        status: 'Not Started',
        priority: '3. Considering',
        notes: 'Selling with Tech Across the Sales Cycle, Prospecting, Competitive Selling, Proposal, Overcoming Objections',
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-03-31'),
        capability: ['End User - Market', 'End User - National'],
        owner: 'Nick/Jamie',
        isStatic: true
    },
    // GPXpress items - all static, not from Coda
    gpxpressItems: [
        {
            project: 'Quality & VOC Evolution',
            status: 'In Progress',
            priority: '1. Primary',
            notes: 'Rethinking our Quality role with a focus on amplifying the VOC with brand teams, sales and categories',
            startDate: new Date('2026-01-01'),
            endDate: new Date('2026-04-17'),
            capability: [],
            owner: 'Olga',
            isStatic: true
        },
        {
            project: 'Interaction Elevation',
            status: 'In Progress',
            priority: '1. Primary',
            notes: 'POV on Interaction Elevation and subsequent experiments. Through service, elevate customer interactions to create leads and aid in retention/churn mitigation.',
            startDate: new Date('2026-01-01'),
            endDate: new Date('2026-06-19'),
            capability: [],
            owner: 'Olga',
            isStatic: true
        },
        {
            project: 'GPXpress AI/Agentforce Q2',
            status: 'In Progress',
            priority: '1. Primary',
            notes: '',
            startDate: new Date('2025-12-01'),
            endDate: new Date('2026-06-30'),
            capability: [],
            owner: 'Isabella',
            isStatic: true
        },
        {
            project: 'GPXpress PRO/Retail Chat Upgrade',
            status: 'In Progress',
            priority: '1. Primary',
            notes: '',
            startDate: new Date('2025-09-29'),
            endDate: new Date('2026-02-14'),
            capability: [],
            owner: 'Isabella',
            isStatic: true
        },
        {
            project: 'GPXpress Catalog Enhancements',
            status: 'In Progress',
            priority: '1. Primary',
            notes: '1. Search Bar (In Progress) 2. Sort Order (In Progress) 3. Discontinued (complete) 4. Missing Images (In Progress)',
            startDate: new Date('2025-07-01'),
            endDate: new Date('2026-06-30'),
            capability: [],
            owner: 'Isabella',
            isStatic: true
        },
        {
            project: 'Drop Ship Process Enhancements',
            status: 'In Progress',
            priority: '1. Primary',
            notes: 're-think and re-design the dropship intake process. cross functional project with BE, IT, SAP IT, Order Management. developing a better process for intake and execution of dropships',
            startDate: new Date('2025-07-01'),
            endDate: new Date('2026-03-31'),
            capability: [],
            owner: 'Isabella',
            isStatic: true
        },
        {
            project: 'GPX Training and Onboarding Reset',
            status: 'In Progress',
            priority: '1. Primary',
            notes: 'GPX Training and Onboarding transformation. Includes Pro and Retail. Goal is to streamline ongoing training and rethink onboarding and create knowledge networks at their fingertips to enable productivity and execution.',
            startDate: new Date('2026-01-01'),
            endDate: new Date('2026-06-19'),
            capability: [],
            owner: 'Isabella',
            isStatic: true
        },
        {
            project: 'GPXpress Mobile App 2.0',
            status: 'In Progress',
            priority: '1. Primary',
            notes: 'mobile app 2.0 enhancements. List of enhancements we would like to make which have all been prioritized for execution. Recently received an additional resource who is moving on the projects. Currently in flight: samples, prosearch, push notifications',
            startDate: new Date('2025-03-03'),
            endDate: new Date('2026-08-03'),
            capability: [],
            owner: 'Isabella',
            isStatic: true
        },
        {
            project: 'SME Evolution',
            status: 'In Progress',
            priority: '1. Primary',
            notes: 'GPX SME protocol transformation',
            startDate: new Date('2026-01-01'),
            endDate: new Date('2026-06-12'),
            capability: [],
            owner: 'Angela',
            isStatic: true
        },
        {
            project: 'GPXpress Online Re-Design',
            status: 'In Progress',
            priority: '2. Secondary',
            notes: 'GPX online re-design. Working on updating look and feel of the online platform so that it is more modern and cohesive with our mobile app. one brand look. working with Workfront team on design their project deadline is 12/1',
            startDate: new Date('2025-09-15'),
            endDate: new Date('2026-06-30'),
            capability: [],
            owner: 'Isabella',
            isStatic: true
        },
        {
            project: 'GPXpress Genesys Enhancements',
            status: 'In Progress',
            priority: '2. Secondary',
            notes: '',
            startDate: new Date('2025-11-01'),
            endDate: new Date('2026-06-30'),
            capability: [],
            owner: 'Isabella',
            isStatic: true
        },
        {
            project: 'Cross Reference Upgrade',
            status: 'In Progress',
            priority: '2. Secondary',
            notes: 'identified area of opportunity to reduce manual workload on gpxpress team. identifying where problem areas are in the current process and discovering ways to improve',
            startDate: new Date('2025-12-08'),
            endDate: new Date('2026-01-30'),
            capability: [],
            owner: 'Isabella',
            isStatic: true
        },
        {
            project: 'Image Recognition MVP',
            status: 'In Progress',
            priority: '2. Secondary',
            notes: '',
            startDate: new Date('2026-01-01'),
            endDate: new Date('2026-03-31'),
            capability: [],
            owner: 'Isabella',
            isStatic: true
        }
    ],
    // L&D items - grouped by person
    ldItems: [
        // Hannah's items
        {
            project: 'Foundational & Role Specific Training',
            status: 'In Progress',
            priority: '1. Primary',
            notes: '',
            startDate: new Date('2026-02-01'),
            endDate: new Date('2026-04-30'),
            capability: [],
            owner: 'Hannah',
            isStatic: true
        },
        {
            project: '3rd Party Sales Training',
            status: 'In Progress',
            priority: '1. Primary',
            notes: '',
            startDate: new Date('2026-01-01'),
            endDate: new Date('2026-03-31'),
            capability: [],
            owner: 'Hannah',
            isStatic: true
        },
        {
            project: 'Talent Planning Launch Plan',
            status: 'In Progress',
            priority: '1. Primary',
            notes: '',
            startDate: new Date('2026-04-01'),
            endDate: new Date('2026-05-31'),
            capability: [],
            owner: 'Hannah',
            isStatic: true
        },
        {
            project: 'Strategic Selling/Insights Scoping',
            status: 'In Progress',
            priority: '1. Primary',
            notes: '',
            startDate: new Date('2026-03-01'),
            endDate: new Date('2026-06-30'),
            capability: [],
            owner: 'Hannah',
            isStatic: true
        },
        // Allison's items
        {
            project: 'Galaxy Strategy, Migration, & Launch',
            status: 'In Progress',
            priority: '1. Primary',
            notes: '',
            startDate: new Date('2026-03-01'),
            endDate: new Date('2026-06-30'),
            capability: [],
            owner: 'Allison',
            isStatic: true
        },
        {
            project: 'JumpStart Pathways',
            status: 'In Progress',
            priority: '2. Secondary',
            notes: '',
            startDate: new Date('2026-04-01'),
            endDate: new Date('2026-06-30'),
            capability: [],
            owner: 'Allison/Donielle',
            isStatic: true
        },
        {
            project: 'LMS Administration',
            status: 'In Progress',
            priority: '4. Ongoing / As Needed',
            notes: '',
            startDate: new Date('2026-01-01'),
            endDate: new Date('2026-06-30'),
            capability: [],
            owner: 'Allison',
            isStatic: true
        },
        // Madison's items
        {
            project: 'Facilitating Superior Meetings',
            status: 'In Progress',
            priority: '2. Secondary',
            notes: '',
            startDate: new Date('2026-03-01'),
            endDate: new Date('2026-04-30'),
            capability: [],
            owner: 'Madison',
            isStatic: true
        },
        {
            project: 'ENGAGE Upgrades/Strategy',
            status: 'In Progress',
            priority: '1. Primary',
            notes: '',
            startDate: new Date('2026-02-01'),
            endDate: new Date('2026-04-30'),
            capability: [],
            owner: 'Madison',
            isStatic: true
        },
        {
            project: 'Leveraging Tech Support (PRO- Dates Variable)',
            status: 'In Progress',
            priority: '4. Ongoing / As Needed',
            notes: '',
            startDate: new Date('2026-01-01'),
            endDate: new Date('2026-06-30'),
            capability: [],
            owner: 'Madison',
            isStatic: true
        },
        {
            project: 'ENGAGE Facilitation & Management',
            status: 'In Progress',
            priority: '4. Ongoing / As Needed',
            notes: '',
            startDate: new Date('2026-01-01'),
            endDate: new Date('2026-06-30'),
            capability: [],
            owner: 'Madison',
            isStatic: true
        },
        // Donielle's items
        {
            project: 'Supply Chain Training',
            status: 'In Progress',
            priority: '2. Secondary',
            notes: '',
            startDate: new Date('2026-05-01'),
            endDate: new Date('2026-06-30'),
            capability: [],
            owner: 'Donielle',
            isStatic: true
        },
        {
            project: 'Roleplay Software Evaluation',
            status: 'In Progress',
            priority: '1. Primary',
            notes: '',
            startDate: new Date('2026-01-01'),
            endDate: new Date('2026-02-28'),
            capability: [],
            owner: 'Donielle',
            isStatic: true
        },
        {
            project: 'EMPOWER Growth App 2.0',
            status: 'In Progress',
            priority: '1. Primary',
            notes: '',
            startDate: new Date('2026-03-01'),
            endDate: new Date('2026-04-30'),
            capability: [],
            owner: 'Donielle',
            isStatic: true
        }
    ]
};

/**
 * Render the current tab's data
 */
function renderCurrentTab() {
    // Summary tab - show summary page, hide timeline
    if (currentTab === 'summary') {
        const container = document.getElementById('timelineContent');
        container.innerHTML = ''; // Clear timeline
        return;
    }
    
    // GPXpress Summary tab - show summary page, hide timeline
    if (currentTab === 'gpxpress-summary') {
        const container = document.getElementById('timelineContent');
        container.innerHTML = ''; // Clear timeline
        return;
    }
    
    // L&D tab uses priority-based grouping like other tabs
    if (currentTab === 'ld') {
        const grouped = groupByPriority(STATIC_ITEMS.ldItems);
        renderTimeline(grouped);
        return;
    }
    
    // GPXpress tab uses only static items, not from Coda
    if (currentTab === 'gpxpress') {
        const grouped = groupByPriority(STATIC_ITEMS.gpxpressItems);
        renderTimeline(grouped);
        return;
    }
    
    const config = TAB_CONFIG[currentTab];
    const filtered = filterDataForTab(allData, config.function, config.owner);
    
    // All tabs use priority-based grouping
    const grouped = groupByPriority(filtered);
    
    // Inject static items
    if (currentTab === 'technology') {
        grouped.primary.unshift(STATIC_ITEMS.salesforceAITech);
    } else if (currentTab === 'strategy') {
        grouped.primary.unshift(STATIC_ITEMS.salesforceAIStrategy);
    } else if (currentTab === 'training') {
        // Add static items to training tab
        grouped.ongoing.push(STATIC_ITEMS.asNeededEmpowerGuides);
        grouped.considering.push(STATIC_ITEMS.strategicSelling);
    }
    
    renderTimeline(grouped);
}

/**
 * Group training items by category (All Sales, Supervisor, Customer Development, End User)
 */
function groupByTrainingCategory(items) {
    const groups = {
        allSales: [],
        supervisor: [],
        customerDev: [],
        endUser: []
    };
    
    items.forEach(item => {
        const audienceLower = (item.audience || '').toLowerCase();
        const capabilityLower = item.capability.map(c => c.toLowerCase()).join(' ');
        const projectLower = (item.project || '').toLowerCase();
        
        // Check if item supports all sales (should be checked first, but not if it's Empower)
        const supportsAllSales = capabilityLower.includes('all pro sales') || 
                                 capabilityLower.includes('all sales') ||
                                 capabilityLower.includes('allprosales');
        
        // Supervisor: items with "Empower" in the name OR audience contains "supervisor"
        if (projectLower.includes('empower') || audienceLower.includes('supervisor')) {
            groups.supervisor.push(item);
        }
        // All Sales: items that support all PRO Sales (but not Empower items)
        else if (supportsAllSales) {
            groups.allSales.push(item);
        }
        // Individual Contributor items - divide by capability
        else if (audienceLower.includes('individual contributor') || audienceLower.includes('ic')) {
            // Customer Development: capability contains customer dev related terms
            if (capabilityLower.includes('customer development') || 
                capabilityLower.includes('cdl') || 
                capabilityLower.includes('customer dev')) {
                groups.customerDev.push(item);
            }
            // End User: capability contains end user related terms
            else if (capabilityLower.includes('end user') || 
                     capabilityLower.includes('enduser') ||
                     capabilityLower.includes('eu')) {
                groups.endUser.push(item);
            }
            // Default to Customer Dev if no match
            else {
                groups.customerDev.push(item);
            }
        }
        // If no audience match, try to categorize by capability alone
        else {
            if (capabilityLower.includes('end user') || capabilityLower.includes('eu')) {
                groups.endUser.push(item);
            } else if (capabilityLower.includes('customer development') || capabilityLower.includes('cdl')) {
                groups.customerDev.push(item);
            } else {
                // Default bucket
                groups.customerDev.push(item);
            }
        }
    });
    
    // Sort each group by status then date
    Object.keys(groups).forEach(key => {
        groups[key].sort((a, b) => {
            const statusOrder = { 'in-progress': 0, 'on-hold': 1, 'ongoing': 1, 'not-started': 2 };
            const aStatus = statusOrder[getStatusClass(a.status)] || 2;
            const bStatus = statusOrder[getStatusClass(b.status)] || 2;
            if (aStatus !== bStatus) return aStatus - bStatus;
            return (a.startDate || new Date()) - (b.startDate || new Date());
        });
    });
    
    return groups;
}

/**
 * Render training timeline with category grouping
 */
function renderTrainingTimeline(groups) {
    const container = document.getElementById('timelineContent');
    container.innerHTML = '';
    
    const categoryOrder = [
        { key: 'allSales', label: 'All Sales', dotClass: 'primary' },
        { key: 'endUser', label: 'End User', dotClass: 'primary' },
        { key: 'customerDev', label: 'Customer Development', dotClass: 'secondary' },
        { key: 'supervisor', label: 'Supervisor Training', dotClass: 'considering' }
    ];
    
    let totalItems = 0;
    const activeStatuses = new Set();
    
    categoryOrder.forEach(category => {
        const items = groups[category.key];
        if (items.length === 0) return;
        
        totalItems += items.length;
        
        // Track active statuses
        items.forEach(item => {
            activeStatuses.add(getStatusClass(item.status));
        });
        
        const groupEl = document.createElement('div');
        groupEl.className = 'priority-group';
        
        // Header
        groupEl.innerHTML = `
            <div class="priority-header">
                <span class="priority-dot ${category.dotClass}"></span>
                <span class="priority-title">${category.label}</span>
            </div>
        `;
        
        // Items
        items.forEach(item => {
            const itemEl = createProjectItem(item, category.dotClass);
            groupEl.appendChild(itemEl);
        });
        
        container.appendChild(groupEl);
    });
    
    // Update legend for training (hide priority legend, show only statuses)
    updateTrainingLegend(activeStatuses);
    
    if (totalItems === 0) {
        container.innerHTML = `<div class="empty-state">No Training priorities found for 2026.</div>`;
    }
}

/**
 * Update legend for training tab
 */
function updateTrainingLegend(activeStatuses) {
    // Hide all priority legend items for training
    document.querySelectorAll('.legend-item[data-priority]').forEach(el => {
        el.classList.add('hidden');
    });
    
    // Show/hide status legend items
    document.querySelectorAll('.legend-item[data-status]').forEach(el => {
        const status = el.dataset.status;
        el.classList.toggle('hidden', !activeStatuses.has(status));
    });
}

// ===== Data Fetching =====

/**
 * Fetch all priorities from Coda
 */
async function fetchAllData() {
    if (typeof CODA_CONFIG === 'undefined' || CODA_CONFIG.API_TOKEN === 'YOUR_API_TOKEN_HERE') {
        throw new Error('Please configure your Coda API token in config.js');
    }

    const url = `${CODA_CONFIG.BASE_URL}/docs/${CODA_CONFIG.DOC_ID}/tables/${encodeURIComponent(CODA_CONFIG.TABLE_ID)}/rows?useColumnNames=true&valueFormat=rich`;
    
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${CODA_CONFIG.API_TOKEN}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
    }

    const data = await response.json();
    return data.items.map(row => transformRow(row));
}

/**
 * Transform Coda row to clean object
 */
function transformRow(row) {
    const v = row.values;
    return {
        id: row.id,
        project: cleanText(v['Project']),
        status: cleanText(v['Status']),
        priority: cleanText(v['Priority']),
        startDate: parseDate(v['Start date']),
        endDate: parseDate(v['End date']),
        notes: cleanText(v['Notes']),
        owner: cleanText(v['SS&E Owner']),
        bc: parseBoolean(v['BC']),
        function: cleanText(v['SS&E Function']),
        capability: parseCapability(v['Capability']),
        audience: cleanText(v['Audience'])
    };
}

/**
 * Clean text from Coda markdown formatting
 */
function cleanText(value) {
    if (value === null || value === undefined) return '';
    
    let text = '';
    if (Array.isArray(value)) {
        text = value.map(item => item.text || String(item)).join('');
    } else if (typeof value === 'object' && value.text) {
        text = value.text;
    } else {
        text = String(value);
    }
    
    return text.replace(/```/g, '').replace(/`/g, '').trim();
}

/**
 * Parse date from Coda format
 */
function parseDate(value) {
    const text = cleanText(value);
    if (!text) return null;
    const date = new Date(text);
    return isNaN(date) ? null : date;
}

/**
 * Parse boolean from Coda format
 */
function parseBoolean(value) {
    if (value === true) return true;
    if (value === false) return false;
    const text = cleanText(value);
    return text.toLowerCase() === 'true' || text.toLowerCase() === 'yes';
}

/**
 * Parse capability field (can be array or string)
 */
function parseCapability(val) {
    if (!val) return [];
    if (Array.isArray(val)) {
        return val.map(v => cleanText(v)).filter(Boolean);
    }
    const cleaned = cleanText(val);
    return cleaned ? [cleaned] : [];
}

// ===== Data Processing =====

/**
 * Filter data for a specific tab (function + owner)
 */
function filterDataForTab(items, functionName, ownerName) {
    return items.filter(item => {
        // Must match function
        if (!item.function || !item.function.toLowerCase().includes(functionName.toLowerCase())) {
            return false;
        }
        // Must have end date on or after Jan 1, 2026
        if (!item.endDate || item.endDate < CUTOFF_DATE) {
            return false;
        }
        // Filter to owner (supports single owner string or array of owners)
        if (!item.owner) {
            return false;
        }
        const itemOwnerLower = item.owner.toLowerCase();
        if (Array.isArray(ownerName)) {
            // Multiple owners - check if item owner matches any
            const matchesAny = ownerName.some(name => itemOwnerLower.includes(name.toLowerCase()));
            if (!matchesAny) {
                return false;
            }
        } else {
            // Single owner
            if (!itemOwnerLower.includes(ownerName.toLowerCase())) {
                return false;
            }
        }
        // Exclude BC items (covered in different priorities discussion)
        if (item.bc === true) {
            return false;
        }
        // Exclude out of scope items
        if (isOutOfScope(item.project)) {
            return false;
        }
        return true;
    });
}

/**
 * Group items by priority
 */
/**
 * Group L&D items by person
 */
function groupByPerson(items) {
    const groups = {
        'Hannah': [],
        'Allison': [],
        'Madison': [],
        'Donielle': []
    };
    
    items.forEach(item => {
        const owner = item.owner || '';
        if (groups[owner]) {
            groups[owner].push(item);
        }
    });
    
    // Sort each person's items by start date
    Object.keys(groups).forEach(person => {
        groups[person].sort((a, b) => {
            const dateA = a.startDate || YEAR_START;
            const dateB = b.startDate || YEAR_START;
            return dateA - dateB;
        });
    });
    
    return groups;
}

function groupByPriority(items) {
    const groups = {
        primary: [],
        secondary: [],
        considering: [],
        ongoing: []
    };
    
    items.forEach(item => {
        const priorityNum = item.priority.charAt(0);
        const config = PRIORITY_CONFIG[priorityNum];
        
        if (config) {
            groups[config.key].push(item);
        } else {
            groups.ongoing.push(item);
        }
    });
    
    // Sort each group by owner (Cindy, Nick, Jamie) then by status (In Progress first, Not Started last) then by start date
    const statusOrder = (status) => {
        if (!status) return 3;
        const s = status.toLowerCase();
        if (s.includes('progress')) return 1;
        if (s.includes('hold')) return 2;
        if (s.includes('ongoing')) return 2;
        return 3; // Not Started last
    };
    
    // Owner sort order: varies by tab
    const ownerOrder = (owner) => {
        if (!owner) return 99;
        const ownerLower = owner.toLowerCase();
        
        // For GPXpress tab: Isabella first, then Angela, then Olga last
        if (currentTab === 'gpxpress') {
            if (ownerLower.includes('isabella')) return 1;
            if (ownerLower.includes('angela')) return 2;
            if (ownerLower.includes('olga')) return 3;
            return 99;
        }
        
        // For training tab: Cindy, Nick, Jamie, then others
        if (currentTab === 'training') {
            if (ownerLower.includes('cindy')) return 1;
            if (ownerLower.includes('nick')) return 2;
            if (ownerLower.includes('jamie')) return 3;
            return 99;
        }
        
        // For L&D tab: Hannah, Allison, Madison, Donielle
        if (currentTab === 'ld') {
            if (ownerLower.includes('hannah')) return 1;
            if (ownerLower.includes('allison')) return 2;
            if (ownerLower.includes('madison')) return 3;
            if (ownerLower.includes('donielle')) return 4;
            return 99;
        }
        
        // Default: others last
        return 99;
    };
    
    Object.keys(groups).forEach(key => {
        groups[key].sort((a, b) => {
            // First sort by owner
            const ownerDiff = ownerOrder(a.owner) - ownerOrder(b.owner);
            if (ownerDiff !== 0) return ownerDiff;
            
            // Then by status
            const statusDiff = statusOrder(a.status) - statusOrder(b.status);
            if (statusDiff !== 0) return statusDiff;
            
            // Finally by start date
            const dateA = a.startDate || YEAR_START;
            const dateB = b.startDate || YEAR_START;
            return dateA - dateB;
        });
    });
    
    return groups;
}

// ===== Rendering =====

/**
 * Render the timeline
 */
function renderTimeline(groups) {
    const container = document.getElementById('timelineContent');
    container.innerHTML = '';
    
    const priorityOrder = [
        { key: 'primary', label: 'Primary', dotClass: 'primary' },
        { key: 'secondary', label: 'Secondary', dotClass: 'secondary' },
        { key: 'considering', label: 'Considering', dotClass: 'considering' },
        { key: 'ongoing', label: 'Ongoing / As Needed', dotClass: 'ongoing' }
    ];
    
    let totalItems = 0;
    const activePriorities = new Set();
    const activeStatuses = new Set();
    let isFirstGroup = true;
    
    priorityOrder.forEach(priority => {
        const items = groups[priority.key];
        if (items.length === 0) return;
        
        totalItems += items.length;
        activePriorities.add(priority.key);
        
        // Track active statuses
        items.forEach(item => {
            activeStatuses.add(getStatusClass(item.status));
        });
        
        const groupEl = document.createElement('div');
        groupEl.className = 'priority-group';
        
        // Header - include timeline months/notes on same row as PRIMARY
        let headerHTML = '';
        if (isFirstGroup) {
            headerHTML = `
                <div class="priority-header-with-timeline">
                    <div class="priority-header-left">
                        <span class="priority-dot ${priority.dotClass}"></span>
                        <span class="priority-title">${priority.label}</span>
                    </div>
                    <div class="timeline-header-inline">
                        <div class="timeline-months">
                            <span>JAN</span>
                            <span>FEB</span>
                            <span>MAR</span>
                            <span>APR</span>
                            <span>MAY</span>
                            <span>JUN</span>
                        </div>
                        <div class="timeline-notes-header">NOTES</div>
                    </div>
                </div>
            `;
            isFirstGroup = false;
        } else {
            headerHTML = `
                <div class="priority-header">
                    <span class="priority-dot ${priority.dotClass}"></span>
                    <span class="priority-title">${priority.label}</span>
                </div>
            `;
        }
        
        groupEl.innerHTML = headerHTML;
        
        // Items
        items.forEach(item => {
            const itemEl = createProjectItem(item, priority.dotClass);
            groupEl.appendChild(itemEl);
        });
        
        container.appendChild(groupEl);
    });
    
    // Update legend to only show relevant items
    updateLegend(activePriorities, activeStatuses);
    
    if (totalItems === 0) {
        const config = TAB_CONFIG[currentTab];
        container.innerHTML = `<div class="empty-state">No ${config.function} priorities found for 2026.</div>`;
    }
}

/**
 * Render timeline grouped by person (for L&D tab)
 */
function renderTimelineByPerson(groups) {
    const container = document.getElementById('timelineContent');
    container.innerHTML = '';
    
    const personOrder = [
        { name: 'Hannah', dotClass: 'primary' },
        { name: 'Allison', dotClass: 'secondary' },
        { name: 'Madison', dotClass: 'considering' },
        { name: 'Donielle', dotClass: 'ongoing' }
    ];
    
    let totalItems = 0;
    const activeStatuses = new Set();
    let isFirstGroup = true;
    
    personOrder.forEach(person => {
        const items = groups[person.name];
        if (items.length === 0) return;
        
        totalItems += items.length;
        
        // Track active statuses
        items.forEach(item => {
            activeStatuses.add(getStatusClass(item.status));
        });
        
        const groupEl = document.createElement('div');
        groupEl.className = 'priority-group';
        
        // Header - include timeline months/notes on same row as first person
        let headerHTML = '';
        if (isFirstGroup) {
            headerHTML = `
                <div class="priority-header-with-timeline">
                    <div class="priority-header-left">
                        <span class="priority-dot ${person.dotClass}"></span>
                        <span class="priority-title">${person.name}</span>
                    </div>
                    <div class="timeline-header-inline">
                        <div class="timeline-months">
                            <span>JAN</span>
                            <span>FEB</span>
                            <span>MAR</span>
                            <span>APR</span>
                            <span>MAY</span>
                            <span>JUN</span>
                        </div>
                        <div class="timeline-notes-header">NOTES</div>
                    </div>
                </div>
            `;
            isFirstGroup = false;
        } else {
            headerHTML = `
                <div class="priority-header">
                    <span class="priority-dot ${person.dotClass}"></span>
                    <span class="priority-title">${person.name}</span>
                </div>
            `;
        }
        
        groupEl.innerHTML = headerHTML;
        
        // Items
        items.forEach(item => {
            const itemEl = createProjectItem(item, person.dotClass);
            groupEl.appendChild(itemEl);
        });
        
        container.appendChild(groupEl);
    });
    
    // Update legend - hide priorities, show only statuses
    document.querySelectorAll('.legend-item[data-priority]').forEach(el => {
        el.classList.add('hidden');
    });
    document.querySelectorAll('.legend-item[data-status]').forEach(el => {
        const status = el.dataset.status;
        el.classList.toggle('hidden', !activeStatuses.has(status));
    });
    
    if (totalItems === 0) {
        container.innerHTML = `<div class="empty-state">No L&D priorities found for 2026.</div>`;
    }
}

/**
 * Update legend to hide items not in current view
 */
function updateLegend(activePriorities, activeStatuses) {
    // Hide/show priority legend items
    document.querySelectorAll('.legend-item[data-priority]').forEach(el => {
        const priority = el.dataset.priority;
        el.classList.toggle('hidden', !activePriorities.has(priority));
    });
    
    // Hide/show status legend items
    document.querySelectorAll('.legend-item[data-status]').forEach(el => {
        const status = el.dataset.status;
        el.classList.toggle('hidden', !activeStatuses.has(status));
    });
}

/**
 * Create a project item element
 */
function createProjectItem(item, priorityClass) {
    const el = document.createElement('div');
    el.className = `project-item ${priorityClass}`;
    
    const statusClass = getStatusClass(item.status);
    
    // Check for overridden end date (app-only)
    const overriddenEndDate = getOverriddenEndDate(item.project, item.endDate);
    const displayEndDate = overriddenEndDate || item.endDate;
    const displayStartDate = item.startDate;
    
    const dates = formatDateRange(displayStartDate, displayEndDate);
    const barStyle = calculateBarStyle(displayStartDate, displayEndDate);
    const hasDependency = item.notes && (
        item.notes.toLowerCase().includes('depend') ||
        item.notes.toLowerCase().includes('pending') ||
        item.notes.toLowerCase().includes('waiting') ||
        item.notes.toLowerCase().includes('blocked')
    );
    
    // Don't show capability tags on content, technology, training, or strategy tabs
    let showCapabilityTags = true;
    if (currentTab === 'content' || currentTab === 'technology' || currentTab === 'training' || currentTab === 'strategy') {
        showCapabilityTags = false;
    }
    
    // Format capability names (End User -> EU)
    const formatCapabilityName = (capability) => {
        return capability.replace(/^End User\s*-\s*/i, 'EU - ');
    };
    
    // Filter out "All PRO Sales" on training tab
    const filteredCapabilities = showCapabilityTags && item.capability.length > 0
        ? (currentTab === 'training' 
            ? item.capability.filter(c => !c.toLowerCase().includes('all pro sales') && !c.toLowerCase().includes('allprosales'))
            : item.capability)
        : [];
    
    const capabilityTags = filteredCapabilities.length > 0
        ? filteredCapabilities.map(c => `<span class="capability-tag ${priorityClass}">${escapeHtml(formatCapabilityName(c))}</span>`).join('') 
        : '';
    
    // Get owner display (show on all tabs)
    // Format owner name: if it contains multiple names without slash, add slash
    let ownerDisplay = '';
    if (item.owner) {
        // Check if owner contains names that should be separated by slash
        // e.g., "CindyNick" -> "Cindy/Nick"
        let formattedOwner = item.owner.replace(/([a-z])([A-Z])/g, '$1/$2');
        ownerDisplay = `<span class="project-owner ${priorityClass}">${escapeHtml(formattedOwner)}</span>`;
    }
    
    // Get notes - check for overridden notes first, then use item notes
    const overriddenNotes = getOverriddenNotes(item.project, item.notes);
    const displayNotes = overriddenNotes || item.notes;
    const shouldShowNotes = displayNotes && !shouldHideNotes(item.project) && (currentTab !== 'training' || shouldShowNotesInTraining(item.project));
    
    el.innerHTML = `
        <div class="project-info">
            <div class="project-name-row">
                <div class="project-name"></div>
                ${ownerDisplay}
                ${currentTab === 'strategy' && capabilityTags ? `<div class="capability-tags capability-tags-inline">${capabilityTags}</div>` : ''}
            </div>
            <div class="project-meta-row">
                ${currentTab !== 'strategy' ? `<div class="capability-tags">${capabilityTags}</div>` : ''}
            </div>
        </div>
        <div class="project-timeline">
            <div class="timeline-grid">
                <span></span><span></span><span></span>
                <span></span><span></span><span></span>
            </div>
            <div class="timeline-bar ${priorityClass} ${statusClass}" style="${barStyle}"></div>
        </div>
        <div class="project-notes-area">
            ${shouldShowNotes ? `<div class="project-notes ${priorityClass}">${escapeHtml(displayNotes)}</div>` : ''}
        </div>
    `;
    
    // Set text content safely (hide parenthetical text, and check for overridden name)
    const overriddenName = getOverriddenProjectName(item.project);
    const baseName = overriddenName || item.project;
    const displayName = baseName.replace(/\s*\([^)]*\)/g, '').trim();
    const nameElement = el.querySelector('.project-name');
    if (nameElement) {
        nameElement.textContent = displayName;
    }
    
    return el;
}

/**
 * Get status CSS class
 */
function getStatusClass(status) {
    if (!status) return 'not-started';
    const s = status.toLowerCase();
    if (s.includes('progress')) return 'in-progress';
    if (s.includes('hold')) return 'on-hold';
    if (s.includes('ongoing')) return 'ongoing';
    return 'not-started';
}

/**
 * Format date range for display
 */
function formatDateRange(start, end) {
    const formatDate = (d) => {
        if (!d) return '?';
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };
    return `${formatDate(start)} → ${formatDate(end)}`;
}

/**
 * Calculate timeline bar position and width
 */
function calculateBarStyle(start, end) {
    // Clamp dates to 2026
    const effectiveStart = start ? Math.max(start, YEAR_START) : YEAR_START;
    const effectiveEnd = end ? Math.min(end, YEAR_END) : YEAR_END;
    
    // Calculate position as percentage of year
    const yearMs = YEAR_END - YEAR_START;
    
    let startPct = ((effectiveStart - YEAR_START) / yearMs) * 100;
    let endPct = ((effectiveEnd - YEAR_START) / yearMs) * 100;
    
    // Handle items starting before Jan 2026
    if (start && start < YEAR_START) {
        startPct = 0;
    }
    
    const width = Math.max(endPct - startPct, 2); // Min 2% width
    
    return `left: ${startPct}%; width: ${width}%;`;
}

/**
 * Escape HTML for safe display
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Check if notes should be hidden for a specific project
 */
function shouldHideNotes(projectName) {
    const hideNotesFor = [
        'CPG SharePoint Management'
    ];
    return hideNotesFor.some(name => projectName.toLowerCase().includes(name.toLowerCase()));
}

/**
 * Check if notes should be shown for a specific project in training tab
 */
function shouldShowNotesInTraining(projectName) {
    const showNotesFor = [
        'Empower Supervisor Call Series',
        'Leveraging Technology Training',
        'Empower Negotiation Guides',
        'As Needed Empower Guides',
        'Negotiation Simulations',
        'Strategic Selling',
        'Prospecting Training Roll Out',
        'Train-the Trainer',
        'Train the Trainer',
        'Copilot, AskFred, KochGPT',
        'AgentForce'
    ];
    return showNotesFor.some(name => projectName.toLowerCase().includes(name.toLowerCase()));
}

/**
 * Get overridden display name for specific projects
 */
function getOverriddenProjectName(projectName) {
    const overriddenNames = {
        'Empower Negotiation Guides': 'Empower Supervisor Negotiation Support',
        'Negotiation Simulations': 'Negotiation Training & Simulations',
        'DSR GP Academy Onboarding Cadence': 'DSR Onboarding Email Cadence',
        'NSM Design Support': 'Retail NSM Design Support',
        'Salesforce Training Library Management': 'SF Training Library Management'
    };
    
    // Check for case-insensitive match
    const projectLower = (projectName || '').toLowerCase();
    for (const [key, value] of Object.entries(overriddenNames)) {
        if (projectLower.includes(key.toLowerCase())) {
            return value;
        }
    }
    return null;
}

/**
 * Get overridden notes for specific projects
 */
function getOverriddenNotes(projectName, originalNotes) {
    const overriddenNotes = {
        'Empower Negotiation Guides': 'TMG Framework Coaching Hours/Simulations/Role Play, Supervisor Coaching Guides',
        'Negotiation Simulations': 'TMG SC Pilot, Framework Coaching Hours, Simulations, Role Play, Framework Planning & Template',
        'GPXperience POV': 'Understanding cost to maintain tool & current use cases along with AI capabilities & vision',
        'NAM Expectations in Salesforce': 'Discussing prioritization/timing with BE',
        'Opportunity Page Refresh': 'Pending completion of sales process project via Project Playbook (PPR: Kate)',
        'Market Dashboard Refresh': 'Includes SC & Market Leadership Dashboards, dependent on BE',
        'Cross Reference Upgrade': 'Looking to reduce manual workload on team',
        'GPXpress Genesys Enhancements': '',
        'GPXpress Einstein Enhancements': '',
        'GPXpress Online Re-Design': 'Working on updating look & feel of the online platform so it is more modern & cohesive with our mobile app',
        'Interaction Elevation': 'Through service, elevate customer interactions to create leads & aid in retention/churn mitigation',
        'GPX Training and Onboarding Reset': 'Streamline ongoing training & rethink onboarding, create knowledge networks at their fingertips to enable productivity and execution',
        'GPXpress AI/Agentforce Q2': '',
        'GPXpress PRO/Retail Chat Upgrade': '',
        'Drop Ship Process Enhancements': 'Re-think & re-design the dropship intake process & execution of dropships',
        'GPXpress Mobile App 2.0': 'Currently in flight: Samples, ProSearch, Push Notifications',
        'Prospecting Training Roll Out': 'Train the trainer for supervisors to roll out with their teams',
        'Train-the Trainer': 'Train the trainer content enabling Supervisors to reinforce Foundational, Role Specific, & OCE concepts with their teams',
        'Train-the-Trainer': 'Train the trainer content enabling Supervisors to reinforce Foundational, Role Specific, & OCE concepts with their teams',
        'Train the Trainer': 'Train the trainer content enabling Supervisors to reinforce Foundational, Role Specific, & OCE concepts with their teams',
        'Copilot, AskFred, KochGPT, & AgentForce': 'Copilot, AskFred, KochGPT, & AgentForce reinforcement & application across the sales cycle for all roles, support of new AI launches',
        'Copilot': 'Copilot, AskFred, KochGPT, & AgentForce reinforcement & application across the sales cycle for all roles, support of new AI launches',
        'AgentForce': 'Copilot, AskFred, KochGPT, & AgentForce reinforcement & application across the sales cycle for all roles, support of new AI launches',
        'AskFred': 'Copilot, AskFred, KochGPT, & AgentForce reinforcement & application across the sales cycle for all roles, support of new AI launches',
        'KochGPT': 'Copilot, AskFred, KochGPT, & AgentForce reinforcement & application across the sales cycle for all roles, support of new AI launches'
    };
    
    // Check for case-insensitive match by project name
    const projectLower = (projectName || '').toLowerCase();
    for (const [key, value] of Object.entries(overriddenNotes)) {
        if (projectLower.includes(key.toLowerCase())) {
            return value;
        }
    }
    
    // Check if notes contain the old text that needs to be replaced
    if (originalNotes && typeof originalNotes === 'string') {
        if (originalNotes.includes('Moving into execution phase post workshop focusing on DA Data Visibility, DA Compliance Expansion, Cascading Territory Planning w/ IAC')) {
            return 'Moving to execution post workshop focusing on DA Data Visibility & Compliance Expansion, & Cascading Territory Planning w/ IAC';
        }
        if (originalNotes.includes('Train-the Trainer Content enabling Supervisors to reinforce Foundational, Role Specific, & OCE concepts more effectively with their teams')) {
            return 'Train the trainer content enabling Supervisors to reinforce Foundational, Role Specific, & OCE concepts with their teams';
        }
        if (originalNotes.includes('Copilot, AskFred, KochGPT') && originalNotes.includes('AgentForce Reinforcement') && originalNotes.includes('Support of New AI Launches')) {
            return 'Copilot, AskFred, KochGPT, & AgentForce reinforcement & application across the sales cycle for all roles, support of new AI launches';
        }
        if (originalNotes.includes('Copilot, AskFred, KochGPT, & AgentForce Reinforcement')) {
            return 'Copilot, AskFred, KochGPT, & AgentForce reinforcement & application across the sales cycle for all roles, support of new AI launches';
        }
    }
    
    return null;
}

/**
 * Get overridden end date for specific projects (app-only, doesn't affect Coda data)
 * Can return a specific date or a function that extends the original date
 */
function getOverriddenEndDate(projectName, originalEndDate) {
    const overriddenDates = {
        'Empower Negotiation Guides': new Date('2026-04-30'),
        'DSR GP Academy Onboarding Cadence': null // Will be calculated as original + 1 month
    };
    
    // Check for case-insensitive match
    const projectLower = (projectName || '').toLowerCase();
    for (const [key, value] of Object.entries(overriddenDates)) {
        if (projectLower.includes(key.toLowerCase())) {
            // If value is null, extend original date by 1 month
            if (value === null && originalEndDate) {
                const extendedDate = new Date(originalEndDate);
                extendedDate.setMonth(extendedDate.getMonth() + 1);
                return extendedDate;
            }
            return value;
        }
    }
    return null;
}

/**
 * Check if a project is out of scope and should be excluded
 */
function isOutOfScope(projectName) {
    if (!projectName) return false;
    
    const outOfScopeProjects = [
        'PBM/HR Supervisor Training',
        'PBM / HR Supervisor Training',
        'PBM-HR Supervisor Training',
        'PBM HR Supervisor Training',
        'Empower Negotiation Guides'
    ];
    const projectLower = projectName.toLowerCase().replace(/[\/\-\s]+/g, ' ');
    return outOfScopeProjects.some(name => {
        const nameLower = name.toLowerCase().replace(/[\/\-\s]+/g, ' ');
        return projectLower.includes(nameLower) || nameLower.includes(projectLower);
    });
}

/**
 * Get out of scope items for a specific tab (function + owner)
 * More lenient filtering - only requires function and owner match, not date
 */
function getOutOfScopeItemsForTab(items, functionName, ownerName) {
    // First, find all out-of-scope items
    const allOutOfScope = items.filter(item => isOutOfScope(item.project));
    
    console.log(`Found ${allOutOfScope.length} total out-of-scope items:`, 
        allOutOfScope.map(i => i.project));
    
    return allOutOfScope.filter(item => {
        // Must match function
        if (!item.function || !item.function.toLowerCase().includes(functionName.toLowerCase())) {
            console.log(`Item "${item.project}" filtered out: function mismatch (${item.function} vs ${functionName})`);
            return false;
        }
        
        // Filter to owner (supports single owner string or array of owners)
        if (!item.owner) {
            console.log(`Item "${item.project}" filtered out: no owner`);
            return false;
        }
        const itemOwnerLower = item.owner.toLowerCase();
        if (Array.isArray(ownerName)) {
            // Multiple owners - check if item owner matches any
            const matchesAny = ownerName.some(name => itemOwnerLower.includes(name.toLowerCase()));
            if (!matchesAny) {
                console.log(`Item "${item.project}" filtered out: owner mismatch (${item.owner} vs ${ownerName.join(', ')})`);
                return false;
            }
        } else {
            // Single owner
            if (!itemOwnerLower.includes(ownerName.toLowerCase())) {
                console.log(`Item "${item.project}" filtered out: owner mismatch (${item.owner} vs ${ownerName})`);
                return false;
            }
        }
        
        // Exclude BC items
        if (item.bc === true) {
            console.log(`Item "${item.project}" filtered out: BC item`);
            return false;
        }
        
        console.log(`Item "${item.project}" passed all filters`);
        // For out of scope items, we don't require the date filter
        // They should show even if dates are outside the range
        return true;
    });
}

/**
 * Populate the out of scope section for a tab
 */
function populateOutOfScopeSection(tabName, outOfScopeItems) {
    const infoSection = document.getElementById(`info-${tabName}`);
    if (!infoSection) {
        console.warn(`Info section not found for tab: ${tabName}`);
        return;
    }
    
    const deprioritizedBox = infoSection.querySelector('.deprioritized-box');
    if (!deprioritizedBox) {
        console.warn(`Deprioritized box not found for tab: ${tabName}`);
        return;
    }
    
    // Remove existing content
    const existingEmpty = deprioritizedBox.querySelector('.info-empty');
    const existingList = deprioritizedBox.querySelector('.info-list');
    
    console.log(`Populating out of scope for ${tabName}:`, outOfScopeItems.length, 'items');
    
    if (outOfScopeItems.length === 0) {
        // Show "None" if no items
        if (existingList) {
            existingList.remove();
        }
        if (existingEmpty) {
            existingEmpty.textContent = 'None';
        } else {
            const emptyDiv = document.createElement('div');
            emptyDiv.className = 'info-empty';
            emptyDiv.textContent = 'None';
            deprioritizedBox.appendChild(emptyDiv);
        }
    } else {
        // Remove empty div if it exists
        if (existingEmpty) {
            existingEmpty.remove();
        }
        
        // Create or get list
        let listEl = existingList;
        if (!listEl) {
            listEl = document.createElement('ul');
            listEl.className = 'info-list';
            deprioritizedBox.appendChild(listEl);
        } else {
            listEl.innerHTML = '';
        }
        
        // Add items to list
        outOfScopeItems.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${escapeHtml(item.project)}</strong>`;
            if (item.notes) {
                li.innerHTML += ` - ${escapeHtml(item.notes)}`;
            }
            listEl.appendChild(li);
        });
    }
}

// ===== UI Helpers =====

function hideLoading() {
    document.getElementById('loading').classList.add('hidden');
}

function showError(message) {
    hideLoading();
    const container = document.getElementById('timelineContent');
    container.innerHTML = `
        <div class="empty-state">
            <p style="color: #DC2626;">Error: ${escapeHtml(message)}</p>
            <p style="margin-top: 0.5rem;">Please check your Coda API configuration.</p>
        </div>
    `;
}

// ===== PDF Export =====

async function downloadPDF() {
    // Check if libraries are loaded
    if (typeof window.jspdf === 'undefined') {
        alert('PDF library not loaded. Please check your internet connection and refresh.');
        return;
    }
    if (typeof html2canvas === 'undefined') {
        alert('Screenshot library not loaded. Please check your internet connection and refresh.');
        return;
    }
    
    const { jsPDF } = window.jspdf;
    // Create PDF with better compatibility settings
    const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
        compress: true // Enable compression for better compatibility
    });
    
    // Hide buttons temporarily
    const buttons = document.querySelector('.header-buttons');
    const originalButtonsDisplay = buttons.style.display;
    buttons.style.display = 'none';
    
    // Get all tab keys (exclude summary if it exists)
    const tabKeys = Object.keys(TAB_CONFIG).filter(key => key !== 'summary');
    const originalTab = currentTab;
    
    try {
        for (let i = 0; i < tabKeys.length; i++) {
            const tabKey = tabKeys[i];
            
            // Switch to this tab
            switchTab(tabKey);
            
            // Wait a moment for rendering
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Keep inactive tabs visible but styled as inactive (they're already grey by default)
            // No need to hide them - they'll appear grey in the PDF
            
            const page = document.getElementById('page');
            
            // Capture the page
            // Ensure consistent sizing by using actual rendered dimensions
            const canvas = await html2canvas(page, {
                scale: 4, // High quality
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                logging: false,
                width: page.scrollWidth,
                height: page.scrollHeight,
                windowWidth: page.scrollWidth,
                windowHeight: page.scrollHeight,
                removeContainer: false
            });
            
            // Use JPEG with high quality for better compatibility
            const imgData = canvas.toDataURL('image/jpeg', 0.98);
            
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            
            // Calculate ratio to fit width
            const ratio = pdfWidth / imgWidth;
            const width = pdfWidth;
            const height = imgHeight * ratio;
            
            // Add new page for each tab after the first
            if (i > 0) {
                pdf.addPage();
            }
            
            // Add image (fit to page height if needed)
            if (height <= pdfHeight) {
                pdf.addImage(imgData, 'JPEG', 0, 0, width, height);
            } else {
                // Scale to fit page height
                const fitRatio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
                const fitWidth = imgWidth * fitRatio;
                const fitHeight = imgHeight * fitRatio;
                const x = (pdfWidth - fitWidth) / 2;
                pdf.addImage(imgData, 'JPEG', x, 0, fitWidth, fitHeight);
            }
            
            // Restore tabs visibility
            inactiveTabs.forEach(tab => tab.style.visibility = '');
        }
        
        // Finalize PDF for better compatibility
        // This ensures the PDF is properly closed and compatible with cloud services
        const filename = `SSE_2026_Priorities_Q1-Q2.pdf`;
        
        // Save the PDF
        pdf.save(filename);
        
        // Small delay to ensure file is fully written
        await new Promise(resolve => setTimeout(resolve, 100));
        
    } catch (error) {
        console.error('PDF generation failed:', error);
        alert('Failed to generate PDF: ' + error.message);
    } finally {
        // Restore buttons
        buttons.style.display = originalButtonsDisplay;
        // Restore original tab
        switchTab(originalTab);
    }
}

/**
 * Refresh data from Coda
 */
async function refreshData() {
    document.getElementById('loading').classList.remove('hidden');
    try {
        allData = await fetchAllData();
        renderCurrentTab();
        hideLoading();
    } catch (error) {
        console.error('Error refreshing data:', error);
        showError(error.message);
    }
}

// Make functions globally accessible
window.downloadPDF = downloadPDF;
window.refreshData = refreshData;
window.switchTab = switchTab;

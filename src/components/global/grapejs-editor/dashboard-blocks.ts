import {
    LayoutDashboard,
    BarChart3,
    PieChart,
    Users,
    Settings,
    Bell,
    Search,
    Calendar,
    CheckSquare,
    MessageSquare,
    Files,
    TrendingUp,
    MoreHorizontal,
    ArrowUpRight,
    ArrowDownRight,
    Clock
} from 'lucide-react'

export const dashboardTemplates = [
    {
        id: 'db-admin-layout',
        label: 'Admin Dashboard',
        icon: LayoutDashboard,
        category: 'dashboard-ui',
        content: `
            <div class="db-container">
                <style>
                    .db-container { font-family: 'Inter', sans-serif; height: 100vh; display: flex; background: #f8fafc; color: #1e293b; }
                    .db-sidebar { width: 260px; background: #0f172a; color: #fff; display: flex; flex-direction: column; }
                    .db-logo { padding: 32px; font-size: 1.25rem; font-weight: 800; letter-spacing: -0.02em; color: #38bdf8; }
                    .db-nav { flex: 1; padding: 0 16px; }
                    .db-nav-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: 8px; color: #94a3b8; text-decoration: none; margin-bottom: 4px; transition: 0.2s; }
                    .db-nav-item:hover { background: rgba(255,255,255,0.05); color: #fff; }
                    .db-nav-item.active { background: #38bdf8; color: #0f172a; font-weight: 600; }
                    
                    .db-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
                    .db-header { height: 80px; background: #fff; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: space-between; px: 32px; padding: 0 32px; }
                    .db-search { display: flex; align-items: center; gap: 12px; background: #f1f5f9; padding: 8px 16px; border-radius: 20px; width: 300px; color: #64748b; font-size: 0.9rem; }
                    
                    .db-content { flex: 1; overflow-y: auto; padding: 32px; }
                    .db-stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; margin-bottom: 32px; }
                    .db-stat-card { background: #fff; padding: 24px; border-radius: 16px; border: 1px solid #e2e8f0; }
                    .db-stat-label { font-size: 0.875rem; color: #64748b; margin-bottom: 8px; display: block; }
                    .db-stat-val { font-size: 1.5rem; font-weight: 700; }
                    .db-stat-trend { font-size: 0.8rem; margin-top: 8px; display: flex; align-items: center; gap: 4px; }
                    
                    .db-table-wrap { background: #fff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; }
                    .db-table-header { padding: 24px; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; }
                    table { width: 100%; border-collapse: collapse; }
                    th { text-align: left; padding: 16px 24px; background: #f8fafc; font-size: 0.75rem; text-transform: uppercase; color: #64748b; }
                    td { padding: 16px 24px; border-bottom: 1px solid #f1f5f9; font-size: 0.875rem; }
                </style>
                <aside class="db-sidebar">
                    <div class="db-logo">INSIGHT.CORE</div>
                    <nav class="db-nav">
                        <a href="#" class="db-nav-item active">Overview</a>
                        <a href="#" class="db-nav-item">Analytics</a>
                        <a href="#" class="db-nav-item">Customers</a>
                        <a href="#" class="db-nav-item">Orders</a>
                        <a href="#" class="db-nav-item">Settings</a>
                    </nav>
                </aside>
                <main class="db-main">
                    <header class="db-header">
                        <div class="db-search">Search anything...</div>
                        <div style="display: flex; gap: 24px; align-items: center;">
                            <div style="position: relative; color: #64748b;">
                                <span style="position: absolute; top: -5px; right: -5px; width: 8px; height: 8px; background: #ef4444; border-radius: 50%;"></span>
                            </div>
                            <div style="width: 40px; height: 40px; background: #e2e8f0; border-radius: 50%;"></div>
                        </div>
                    </header>
                    <div class="db-content">
                        <div class="db-stats-grid">
                            <div class="db-stat-card">
                                <span class="db-stat-label">Total Revenue</span>
                                <div class="db-stat-val">$48,250.00</div>
                                <div class="db-stat-trend" style="color: #22c55e;">+12.5% from last month</div>
                            </div>
                            <div class="db-stat-card">
                                <span class="db-stat-label">Active Users</span>
                                <div class="db-stat-val">2,450</div>
                                <div class="db-stat-trend" style="color: #22c55e;">+4.2% from last month</div>
                            </div>
                            <div class="db-stat-card">
                                <span class="db-stat-label">Active Subs</span>
                                <div class="db-stat-val">1,120</div>
                                <div class="db-stat-trend" style="color: #ef4444;">-0.8% from last month</div>
                            </div>
                            <div class="db-stat-card">
                                <span class="db-stat-label">Avg. Session</span>
                                <div class="db-stat-val">4m 32s</div>
                                <div class="db-stat-trend" style="color: #22c55e;">+18% from last month</div>
                            </div>
                        </div>
                        <div class="db-table-wrap">
                            <div class="db-table-header">
                                <h3 style="font-size: 1.125rem; font-weight: 700;">Recent Transactions</h3>
                                <button style="background: #f1f5f9; border: none; padding: 8px 16px; border-radius: 8px; font-size: 0.8rem; font-weight: 600; cursor: pointer;">View All</button>
                            </div>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Customer</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                        <th>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><strong>Alex Johnson</strong><br/><span style="font-size: 0.75rem; color: #64748b;">alex@example.com</span></td>
                                        <td><span style="padding: 4px 10px; background: #ecfdf5; color: #059669; border-radius: 100px; font-size: 0.7rem; font-weight: 700;">COMPLETED</span></td>
                                        <td>Feb 14, 2024</td>
                                        <td><strong>$125.00</strong></td>
                                    </tr>
                                    <tr>
                                        <td><strong>Sarah Smith</strong><br/><span style="font-size: 0.75rem; color: #64748b;">sarah@example.com</span></td>
                                        <td><span style="padding: 4px 10px; background: #fef3c7; color: #d97706; border-radius: 100px; font-size: 0.7rem; font-weight: 700;">PENDING</span></td>
                                        <td>Feb 13, 2024</td>
                                        <td><strong>$450.00</strong></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        `
    },
    {
        id: 'db-analytics-page',
        label: 'Analytics Overview',
        icon: BarChart3,
        category: 'dashboard-ui',
        content: `
            <div class="an-container">
                <style>
                    .an-container { font-family: 'Inter', sans-serif; background: #f8fafc; padding: 40px; color: #1e293b; }
                    .an-header { margin-bottom: 40px; display: flex; justify-content: space-between; align-items: flex-end; }
                    .an-title { font-size: 2rem; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 8px; }
                    .an-subtitle { color: #64748b; font-size: 1rem; }
                    
                    .an-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 32px; }
                    .an-card { background: #fff; padding: 32px; border-radius: 24px; border: 1px solid #e2e8f0; }
                    .an-card-title { font-size: 1.1rem; font-weight: 700; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; }
                    
                    .an-chart-placeholder { width: 100%; height: 300px; background: #f1f5f9; border-radius: 16px; position: relative; display: flex; align-items: flex-end; justify-content: space-around; padding: 20px; box-sizing: border-box; }
                    .an-bar { width: 40px; background: #3b82f6; border-radius: 6px 6px 0 0; transition: 0.3s; }
                    .an-bar:hover { background: #2563eb; }
                    
                    .an-list { display: flex; flex-direction: column; gap: 20px; }
                    .an-list-item { display: flex; align-items: center; gap: 16px; }
                    .an-progress-wrap { flex: 1; height: 8px; background: #f1f5f9; border-radius: 4px; overflow: hidden; }
                    .an-progress-bar { height: 100%; background: #3b82f6; border-radius: 4px; }
                </style>
                <header class="an-header">
                    <div>
                        <h1 class="an-title">Analytics Activity</h1>
                        <p class="an-subtitle">Monitor your platform performance and user engagement.</p>
                    </div>
                    <div style="display: flex; gap: 12px;">
                        <select style="padding: 10px 20px; border-radius: 12px; border: 1px solid #e2e8f0; background: #fff; font-weight: 600;">
                            <option>Last 30 Days</option>
                            <option>Last 3 Months</option>
                        </select>
                        <button style="background: #0f172a; color: #fff; border: none; padding: 10px 24px; border-radius: 12px; font-weight: 600; cursor: pointer;">Download Report</button>
                    </div>
                </header>
                <div class="an-grid">
                    <div class="an-card">
                        <div class="an-card-title">User Acquisition <span>+15.2%</span></div>
                        <div class="an-chart-placeholder">
                            <div class="an-bar" style="height: 40%;"></div>
                            <div class="an-bar" style="height: 65%;"></div>
                            <div class="an-bar" style="height: 50%;"></div>
                            <div class="an-bar" style="height: 85%;"></div>
                            <div class="an-bar" style="height: 60%;"></div>
                            <div class="an-bar" style="height: 75%;"></div>
                            <div class="an-bar" style="height: 90%;"></div>
                        </div>
                    </div>
                    <div class="an-card">
                        <div class="an-card-title">Top Channels</div>
                        <div class="an-list">
                            <div class="an-list-item">
                                <div style="width: 100px; font-size: 0.85rem; font-weight: 600;">Organic</div>
                                <div class="an-progress-wrap"><div class="an-progress-bar" style="width: 65%;"></div></div>
                                <div style="width: 40px; font-size: 0.85rem; font-weight: 700; text-align: right;">65%</div>
                            </div>
                            <div class="an-list-item">
                                <div style="width: 100px; font-size: 0.85rem; font-weight: 600;">Direct</div>
                                <div class="an-progress-wrap"><div class="an-progress-bar" style="width: 20%; background: #94a3b8;"></div></div>
                                <div style="width: 40px; font-size: 0.85rem; font-weight: 700; text-align: right;">20%</div>
                            </div>
                            <div class="an-list-item">
                                <div style="width: 100px; font-size: 0.85rem; font-weight: 600;">Referral</div>
                                <div class="an-progress-wrap"><div class="an-progress-bar" style="width: 15%; background: #38bdf8;"></div></div>
                                <div style="width: 40px; font-size: 0.85rem; font-weight: 700; text-align: right;">15%</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
    },
    {
        id: 'db-pm-layout',
        label: 'Project Manager',
        icon: CheckSquare,
        category: 'dashboard-ui',
        content: `
            <div class="pm-container">
                <style>
                    .pm-container { font-family: 'Inter', sans-serif; background: #fff; color: #1e293b; min-height: 100vh; }
                    .pm-header { padding: 40px 60px; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; }
                    .pm-title { font-size: 2.25rem; font-weight: 800; letter-spacing: -0.03em; }
                    
                    .pm-kanban { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; padding: 40px 60px; }
                    .pm-column { background: #f8fafc; border-radius: 20px; padding: 24px; }
                    .pm-col-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
                    .pm-col-title { font-weight: 700; font-size: 0.9rem; text-transform: uppercase; color: #64748b; letter-spacing: 0.05em; }
                    .pm-count { background: #e2e8f0; padding: 2px 8px; border-radius: 6px; font-size: 0.75rem; color: #475569; }
                    
                    .pm-card { background: #fff; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 16px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
                    .pm-card-tag { display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 700; margin-bottom: 12px; }
                    .pm-card-title { font-weight: 600; font-size: 1rem; margin-bottom: 12px; line-height: 1.4; }
                    .pm-card-meta { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f1f5f9; padding-top: 12px; margin-top: 12px; }
                    
                    .avatar-group { display: flex; margin-left: 8px; }
                    .avatar-mini { width: 24px; height: 24px; border-radius: 50%; border: 2px solid #fff; margin-left: -8px; background: #cbd5e1; }
                </style>
                <header class="pm-header">
                    <div>
                        <h1 class="pm-title">Website Redesign 🚀</h1>
                        <div style="display: flex; gap: 20px; margin-top: 12px; color: #64748b; font-size: 0.9rem;">
                            <span>7 Members</span>
                            <span>24 Tasks</span>
                            <span>85% Complete</span>
                        </div>
                    </div>
                    <button style="background: #3b82f6; color: #fff; border: none; padding: 12px 24px; border-radius: 12px; font-weight: 700; cursor: pointer;">Add Task</button>
                </header>
                <div class="pm-kanban">
                    <div class="pm-column">
                        <div class="pm-col-header">
                            <span class="pm-col-title">To Do</span>
                            <span class="pm-count">3</span>
                        </div>
                        <div class="pm-card">
                            <span class="pm-card-tag" style="background: #eff6ff; color: #3b82f6;">Design</span>
                            <div class="pm-card-title">Define color palette and typography for brand</div>
                            <div class="pm-card-meta">
                                <span style="font-size: 0.8rem; color: #64748b;">Feb 20</span>
                                <div class="avatar-group"><div class="avatar-mini"></div><div class="avatar-mini"></div></div>
                            </div>
                        </div>
                    </div>
                    <div class="pm-column">
                        <div class="pm-col-header">
                            <span class="pm-col-title">In Progress</span>
                            <span class="pm-count">2</span>
                        </div>
                        <div class="pm-card">
                            <span class="pm-card-tag" style="background: #fdf2f7; color: #db2777;">Frontend</span>
                            <div class="pm-card-title">Implement responsive navigation with Framer Motion</div>
                            <div class="pm-card-meta">
                                <span style="font-size: 0.8rem; color: #64748b;">Feb 18</span>
                                <div class="avatar-group"><div class="avatar-mini"></div></div>
                            </div>
                        </div>
                    </div>
                    <div class="pm-column">
                        <div class="pm-col-header">
                            <span class="pm-col-title">Completed</span>
                            <span class="pm-count">12</span>
                        </div>
                        <div class="pm-card">
                            <span class="pm-card-tag" style="background: #ecfdf5; color: #059669;">Research</span>
                            <div class="pm-card-title">User interview synthesis and core personas</div>
                            <div class="pm-card-meta">
                                <span style="font-size: 0.8rem; color: #64748b;">✅ Done</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
    },
    {
        id: 'db-client-portal',
        label: 'Client Portal',
        icon: Users,
        category: 'dashboard-ui',
        content: `
            <div class="cp-container">
                <style>
                    .cp-container { font-family: 'Outfit', sans-serif; background: #fff; color: #0f172a; }
                    .cp-top { background: #0f172a; color: #fff; padding: 60px 8%; }
                    .cp-welcome { font-size: 2.5rem; font-weight: 800; margin-bottom: 12px; }
                    .cp-status { display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; background: rgba(255,255,255,0.1); border-radius: 100px; font-size: 0.9rem; font-weight: 600; }
                    
                    .cp-sections { padding: 60px 8%; display: grid; grid-template-columns: 1fr 350px; gap: 48px; }
                    .cp-section-title { font-size: 1.25rem; font-weight: 800; margin-bottom: 24px; color: #1e293b; }
                    
                    .cp-project-card { border: 1px solid #e2e8f0; border-radius: 20px; padding: 32px; margin-bottom: 24px; position: relative; }
                    .cp-prog-info { display: flex; justify-content: space-between; margin-bottom: 12px; font-weight: 700; font-size: 0.95rem; }
                    .cp-prog-bg { height: 10px; background: #f1f5f9; border-radius: 5px; overflow: hidden; }
                    .cp-prog-fill { height: 100%; background: #3b82f6; width: 65%; border-radius: 5px; }
                    
                    .cp-file-item { display: flex; align-items: center; justify-content: space-between; padding: 16px; background: #f8fafc; border-radius: 12px; margin-bottom: 12px; transition: 0.2s; }
                    .cp-file-item:hover { background: #f1f5f9; }
                    
                    .cp-msg-btn { width: 100%; padding: 16px; background: #3b82f6; color: #fff; border: none; border-radius: 12px; font-weight: 700; cursor: pointer; margin-top: 24px; }
                </style>
                <div class="cp-top">
                    <h1 class="cp-welcome">Hello, Morgan Maxwell 👋</h1>
                    <div class="cp-status">
                        <span style="width: 8px; height: 8px; background: #4ade80; border-radius: 50%;"></span>
                        Project: Brand Strategy & Identity
                    </div>
                </div>
                <div class="cp-sections">
                    <main>
                        <h2 class="cp-section-title">Active Projects</h2>
                        <div class="cp-project-card">
                            <div style="margin-bottom: 24px;">
                                <h3 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 8px;">Identity Design Phase</h3>
                                <p style="color: #64748b; font-size: 1rem;">We are currently refining the primary mark and color systems based on your feedback.</p>
                            </div>
                            <div class="cp-prog-info">
                                <span>Completion</span>
                                <span>65%</span>
                            </div>
                            <div class="cp-prog-bg"><div class="cp-prog-fill"></div></div>
                        </div>
                        
                        <h2 class="cp-section-title">Recent Files</h2>
                        <div class="cp-file-item">
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <div style="color: #3b82f6;"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
                                <div>
                                    <div style="font-weight: 700; font-size: 0.95rem;">Mood_Board_v2.pdf</div>
                                    <div style="font-size: 0.8rem; color: #64748b;">Uploaded 2 hours ago</div>
                                </div>
                            </div>
                            <button style="border: 1px solid #e2e8f0; background: #fff; padding: 6px 12px; border-radius: 8px; font-size: 0.8rem; font-weight: 600; cursor: pointer;">Download</button>
                        </div>
                    </main>
                    <aside>
                        <div style="background: #f8fafc; border-radius: 20px; padding: 32px; border: 1px solid #e2e8f0;">
                            <h3 style="font-size: 1.1rem; font-weight: 800; margin-bottom: 20px;">Contact Manager</h3>
                            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 24px;">
                                <div style="width: 48px; height: 48px; background: #3b82f6; border-radius: 50%;"></div>
                                <div>
                                    <div style="font-weight: 700;">Sarah Jenkins</div>
                                    <div style="font-size: 0.85rem; color: #64748b;">Account Lead</div>
                                </div>
                            </div>
                            <button class="cp-msg-btn">Send Message</button>
                        </div>
                    </aside>
                </div>
            </div>
        `
    }
]

import React, { useEffect, useState } from "react";
import "./enhanced-options.css";
import { CATEGORIES, DEFAULT_CATEGORY_PATTERNS } from "../utils/categories.js";

export default function Options() {
    const [settings, setSettings] = useState({
        contentScanning: true,
        emotionalAnalysis: true,
        productivityTracking: true,
        biasDetection: true,
        excludeList: [],
        scanInterval: 30000,
        onboardingCompleted: false,
    });

    const [userCategories, setUserCategories] = useState({});
    const [excludeText, setExcludeText] = useState("");
    const [newSiteUrl, setNewSiteUrl] = useState("");
    const [newSiteCategory, setNewSiteCategory] = useState(
        CATEGORIES.PRODUCTIVITY
    );
    const [status, setStatus] = useState("");
    const [activeTab, setActiveTab] = useState("general");

    useEffect(() => {
        // Load current settings
        chrome.storage.local.get(
            {
                settings: {
                    contentScanning: true,
                    emotionalAnalysis: true,
                    productivityTracking: true,
                    biasDetection: true,
                    excludeList: [],
                    scanInterval: 30000,
                    onboardingCompleted: false,
                },
                userCategories: {},
            },
            (res) => {
                setSettings(res.settings || {});
                setUserCategories(res.userCategories || {});
                setExcludeText((res.settings.excludeList || []).join("\\n"));
            }
        );
    }, []);

    function updateSetting(key, value) {
        const newSettings = { ...settings, [key]: value };
        setSettings(newSettings);
        chrome.storage.local.set({ settings: newSettings }, () => {
            showStatus("Settings saved");
        });
    }

    function saveExcludeList() {
        const excludeList = excludeText
            .split("\\n")
            .map((x) => x.trim())
            .filter(Boolean);
        updateSetting("excludeList", excludeList);
    }

    function addSiteCategory() {
        if (!newSiteUrl.trim()) {
            showStatus("Please enter a valid URL");
            return;
        }

        const newCategories = { ...userCategories };
        if (!newCategories[newSiteCategory]) {
            newCategories[newSiteCategory] = [];
        }

        const domain = extractDomain(newSiteUrl);
        if (!newCategories[newSiteCategory].includes(domain)) {
            newCategories[newSiteCategory].push(domain);
            setUserCategories(newCategories);
            chrome.storage.local.set({ userCategories: newCategories }, () => {
                showStatus(`Added ${domain} to ${newSiteCategory} category`);
                setNewSiteUrl("");
            });
        } else {
            showStatus("Site already exists in this category");
        }
    }

    function removeSiteCategory(category, domain) {
        const newCategories = { ...userCategories };
        if (newCategories[category]) {
            newCategories[category] = newCategories[category].filter(
                (d) => d !== domain
            );
            if (newCategories[category].length === 0) {
                delete newCategories[category];
            }
        }
        setUserCategories(newCategories);
        chrome.storage.local.set({ userCategories: newCategories }, () => {
            showStatus(`Removed ${domain} from ${category} category`);
        });
    }

    function extractDomain(url) {
        try {
            return new URL(url.startsWith("http") ? url : `https://${url}`)
                .hostname;
        } catch {
            return url.toLowerCase();
        }
    }

    function showStatus(message) {
        setStatus(message);
        setTimeout(() => setStatus(""), 3000);
    }

    function resetToDefaults() {
        const defaultSettings = {
            contentScanning: true,
            emotionalAnalysis: true,
            productivityTracking: true,
            biasDetection: true,
            excludeList: [],
            scanInterval: 30000,
            onboardingCompleted: false,
        };

        setSettings(defaultSettings);
        setUserCategories({});
        setExcludeText("");

        chrome.storage.local.set(
            {
                settings: defaultSettings,
                userCategories: {},
            },
            () => {
                showStatus("Settings reset to defaults");
            }
        );
    }

    function exportData() {
        chrome.storage.local.get(
            ["events", "contentAnalyses", "settings", "userCategories"],
            (res) => {
                const data = {
                    events: res.events || [],
                    contentAnalyses: res.contentAnalyses || [],
                    settings: res.settings || {},
                    userCategories: res.userCategories || {},
                    exportDate: new Date().toISOString(),
                };

                const blob = new Blob([JSON.stringify(data, null, 2)], {
                    type: "application/json",
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `digital-footprint-data-${
                    new Date().toISOString().split("T")[0]
                }.json`;
                a.click();
                URL.revokeObjectURL(url);
                showStatus("Data exported successfully");
            }
        );
    }

    function clearAllData() {
        if (
            confirm(
                "Are you sure you want to clear all tracking data? This cannot be undone."
            )
        ) {
            chrome.storage.local.clear(() => {
                showStatus("All data cleared");
                // Reload to reset the UI
                window.location.reload();
            });
        }
    }

    return (
        <div className="options-container">
            <header className="options-header">
                <h1>🦶 Digital Footprint Settings</h1>
                <p>
                    Configure your privacy-focused activity tracking and
                    analysis
                </p>
            </header>

            <div className="tabs">
                <button
                    className={`tab ${activeTab === "general" ? "active" : ""}`}
                    onClick={() => setActiveTab("general")}
                >
                    General
                </button>
                <button
                    className={`tab ${
                        activeTab === "categories" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("categories")}
                >
                    Site Categories
                </button>
                <button
                    className={`tab ${activeTab === "privacy" ? "active" : ""}`}
                    onClick={() => setActiveTab("privacy")}
                >
                    Privacy & Data
                </button>
            </div>

            {activeTab === "general" && (
                <div className="tab-content">
                    <div className="settings-group">
                        <h2>📊 Analysis Features</h2>

                        <div className="setting-item">
                            <label className="setting-label">
                                <input
                                    type="checkbox"
                                    checked={settings.contentScanning}
                                    onChange={(e) =>
                                        updateSetting(
                                            "contentScanning",
                                            e.target.checked
                                        )
                                    }
                                />
                                <div className="setting-info">
                                    <span className="setting-title">
                                        Content Scanning
                                    </span>
                                    <span className="setting-desc">
                                        Analyze text content for insights and
                                        categorization
                                    </span>
                                </div>
                            </label>
                        </div>

                        <div className="setting-item">
                            <label className="setting-label">
                                <input
                                    type="checkbox"
                                    checked={settings.emotionalAnalysis}
                                    onChange={(e) =>
                                        updateSetting(
                                            "emotionalAnalysis",
                                            e.target.checked
                                        )
                                    }
                                />
                                <div className="setting-info">
                                    <span className="setting-title">
                                        Emotional Analysis
                                    </span>
                                    <span className="setting-desc">
                                        Track emotional balance of content
                                        consumed
                                    </span>
                                </div>
                            </label>
                        </div>

                        <div className="setting-item">
                            <label className="setting-label">
                                <input
                                    type="checkbox"
                                    checked={settings.biasDetection}
                                    onChange={(e) =>
                                        updateSetting(
                                            "biasDetection",
                                            e.target.checked
                                        )
                                    }
                                />
                                <div className="setting-info">
                                    <span className="setting-title">
                                        Bias Detection
                                    </span>
                                    <span className="setting-desc">
                                        Identify potentially biased or harmful
                                        content
                                    </span>
                                </div>
                            </label>
                        </div>

                        <div className="setting-item">
                            <label className="setting-label">
                                <input
                                    type="checkbox"
                                    checked={settings.productivityTracking}
                                    onChange={(e) =>
                                        updateSetting(
                                            "productivityTracking",
                                            e.target.checked
                                        )
                                    }
                                />
                                <div className="setting-info">
                                    <span className="setting-title">
                                        Productivity Tracking
                                    </span>
                                    <span className="setting-desc">
                                        Monitor and analyze productive vs
                                        distracting time
                                    </span>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div className="settings-group">
                        <h2>⚙️ Advanced Settings</h2>

                        <div className="setting-item">
                            <label className="setting-label">
                                <span className="setting-title">
                                    Scan Interval
                                </span>
                                <select
                                    value={settings.scanInterval}
                                    onChange={(e) =>
                                        updateSetting(
                                            "scanInterval",
                                            parseInt(e.target.value)
                                        )
                                    }
                                    className="setting-select"
                                >
                                    <option value={15000}>
                                        Every 15 seconds
                                    </option>
                                    <option value={30000}>
                                        Every 30 seconds
                                    </option>
                                    <option value={60000}>Every minute</option>
                                    <option value={300000}>
                                        Every 5 minutes
                                    </option>
                                </select>
                            </label>
                        </div>
                    </div>

                    <div className="settings-group">
                        <h2>🚫 Excluded Sites</h2>
                        <p>
                            Enter domains to exclude from tracking (one per
                            line)
                        </p>
                        <textarea
                            value={excludeText}
                            onChange={(e) => setExcludeText(e.target.value)}
                            rows={6}
                            className="exclude-textarea"
                            placeholder="example.com&#10;private-site.org&#10;work-internal.com"
                        />
                        <button
                            onClick={saveExcludeList}
                            className="btn-primary"
                        >
                            Save Exclude List
                        </button>
                    </div>
                </div>
            )}

            {activeTab === "categories" && (
                <div className="tab-content">
                    <div className="settings-group">
                        <h2>🏷️ Custom Site Categories</h2>
                        <p>
                            Customize how websites are categorized for better
                            insights
                        </p>

                        <div className="add-category">
                            <input
                                type="text"
                                placeholder="Enter website URL or domain"
                                value={newSiteUrl}
                                onChange={(e) => setNewSiteUrl(e.target.value)}
                                className="category-input"
                            />
                            <select
                                value={newSiteCategory}
                                onChange={(e) =>
                                    setNewSiteCategory(e.target.value)
                                }
                                className="category-select"
                            >
                                {Object.values(CATEGORIES).map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat.charAt(0).toUpperCase() +
                                            cat.slice(1)}
                                    </option>
                                ))}
                            </select>
                            <button
                                onClick={addSiteCategory}
                                className="btn-primary"
                            >
                                Add
                            </button>
                        </div>

                        <div className="category-list">
                            {Object.entries(userCategories).map(
                                ([category, domains]) => (
                                    <div
                                        key={category}
                                        className="category-section"
                                    >
                                        <h3 className="category-title">
                                            {category.charAt(0).toUpperCase() +
                                                category.slice(1)}
                                        </h3>
                                        <div className="domain-list">
                                            {domains.map((domain) => (
                                                <div
                                                    key={domain}
                                                    className="domain-item"
                                                >
                                                    <span>{domain}</span>
                                                    <button
                                                        onClick={() =>
                                                            removeSiteCategory(
                                                                category,
                                                                domain
                                                            )
                                                        }
                                                        className="btn-remove"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )
                            )}
                        </div>

                        {Object.keys(userCategories).length === 0 && (
                            <div className="empty-state">
                                <p>
                                    No custom categories defined yet. Add
                                    websites above to get started!
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === "privacy" && (
                <div className="tab-content">
                    <div className="settings-group">
                        <h2>🔒 Privacy & Data Management</h2>

                        <div className="privacy-info">
                            <div className="privacy-card">
                                <h3>📱 Local Storage</h3>
                                <p>
                                    All your data is stored locally in your
                                    browser. Nothing is sent to external servers
                                    unless you configure API endpoints.
                                </p>
                            </div>

                            <div className="privacy-card">
                                <h3>🔐 Sensitive Data</h3>
                                <p>
                                    Passwords, credit card numbers, and other
                                    sensitive inputs are automatically excluded
                                    from analysis.
                                </p>
                            </div>

                            <div className="privacy-card">
                                <h3>🎛️ Full Control</h3>
                                <p>
                                    You have complete control over what data is
                                    collected and can disable any feature or
                                    clear all data at any time.
                                </p>
                            </div>
                        </div>

                        <div className="data-actions">
                            <button
                                onClick={exportData}
                                className="btn-secondary"
                            >
                                📁 Export My Data
                            </button>
                            <button
                                onClick={resetToDefaults}
                                className="btn-secondary"
                            >
                                🔄 Reset to Defaults
                            </button>
                            <button
                                onClick={clearAllData}
                                className="btn-danger"
                            >
                                🗑️ Clear All Data
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {status && <div className="status-message">{status}</div>}
        </div>
    );
}

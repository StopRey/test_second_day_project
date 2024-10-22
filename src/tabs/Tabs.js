import React, { useEffect, useState, useRef } from 'react';
import './tabs.css';
import tabIcon from '../photo/pin.png';
import tabIconleft from '../photo/leftbutton.png';

const Tabs = () => {
    const [tabs, setTabs] = useState([]);
    const [pinnedTabs, setPinnedTabs] = useState([]);
    const [newTabName, setNewTabName] = useState('');
    const [newTabUrl, setNewTabUrl] = useState('');
    const [activeTab, setActiveTab] = useState(null);
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [draggedArray, setDraggedArray] = useState(null);
    const [changed, setChanged] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [hoveredArray, setHoveredArray] = useState(null);
    const [activeTabInfo, setActiveTabInfo] = useState(null);
    const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
    const [showPinnedTabs, setShowPinnedTabs] = useState(true);
    const [showToggleTooltip, setShowToggleTooltip] = useState(false);
    const [showBurgerMenu, setShowBurgerMenu] = useState(false);
    const [burgerTabs, setBurgerTabs] = useState([]);
    const burgerMenuRef = useRef(null);
    const tabContainerRef = useRef(null);
    const toggleBurgerMenuRef = useRef(null);


    useEffect(() => {
        const savedTabs = JSON.parse(localStorage.getItem('tabs')) || [];
        const savedPinnedTabs = JSON.parse(localStorage.getItem('pinnedTabs')) || [];
        setTabs(savedTabs);
        setPinnedTabs(savedPinnedTabs);
        setChanged(true);
    }, []);

    useEffect(() => {
        if (changed) {
            localStorage.setItem('tabs', JSON.stringify(tabs));
            localStorage.setItem('pinnedTabs', JSON.stringify(pinnedTabs));
        }
    }, [changed, tabs, pinnedTabs]);

    const handleClickOutside = (event) => {
        if (burgerMenuRef.current && !burgerMenuRef.current.contains(event.target) && !toggleBurgerMenuRef.current.contains(event.target)) {
            if (showBurgerMenu) {
                setTabs((prev) => [...prev, ...burgerTabs]);
                setBurgerTabs([]);
                setShowBurgerMenu(false);
                setChanged(true);
            }
        }
    };

    const toggleBurgerMenu = () => {
        if (!showBurgerMenu) {
            setChanged(false);

            const container = tabContainerRef.current;

            let count = 0;

            if (container) {
                const children = Array.from(container.children);
                let totalWidth = 0;

                children.forEach(child => {
                    const childWidth = child.offsetWidth;
                    totalWidth += childWidth;

                    if (totalWidth <= container.offsetWidth) {
                        count++;
                    }
                });
            }

            const visibleTabs = tabs.slice(0, count);
            const overflowTabs = tabs.slice(count);
            setTabs(visibleTabs);
            setBurgerTabs(overflowTabs);
        } else {
            setTabs((prev) => [...prev, ...burgerTabs]);
            setBurgerTabs([]);
        }
        setShowBurgerMenu((prev) => !prev);
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showBurgerMenu, burgerTabs]);

    const handleDragStart = (index, arrayType) => {
        setDraggedIndex(index);
        setDraggedArray(arrayType);
    };

    const handleDrop = (e, targetIndex, isPinned) => {
        e.preventDefault();
        const draggedTab = draggedArray === 'pinned' ? pinnedTabs[draggedIndex] : tabs[draggedIndex];

        if (isPinned) {
            setPinnedTabs((prev) => {
                const newPinned = [...prev];
                newPinned.splice(draggedIndex, 1);
                newPinned.splice(targetIndex, 0, draggedTab);
                return newPinned;
            });
        } else {
            setTabs((prev) => {
                const newTabs = [...prev];
                newTabs.splice(draggedIndex, 1);
                newTabs.splice(targetIndex, 0, draggedTab);
                return newTabs;
            });
        }
        setDraggedIndex(null);
        setDraggedArray(null);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleRightClick = (e, index, sourceArray) => {
        e.preventDefault();
        const tabToPin = sourceArray[index];

        if (sourceArray === tabs) {
            setChanged(false);
            setPinnedTabs((prev) => [...prev, tabToPin]);
            setTabs((prev) => prev.filter((_, i) => i !== index));
            setChanged(true);
        } else {
            setChanged(false);
            setTabs((prev) => [...prev, tabToPin]);
            setPinnedTabs((prev) => prev.filter((_, i) => i !== index));
            setChanged(true);
        }
    };

    const handleBurgerRightClick = (e, index) => {
        e.preventDefault();
        const tabToPin = burgerTabs[index];

        setPinnedTabs((prev) => [...prev, tabToPin]);
        setBurgerTabs((prev) => prev.filter((_, i) => i !== index));

    };

    const handleAddTab = () => {
        if (newTabName.trim() && newTabUrl.trim()) {
            const newTab = { name: newTabName, url: newTabUrl }; // Створення нового табу як об'єкта
            setTabs((prev) => [...prev, newTab]);
            setNewTabName('');
            setNewTabUrl(''); // Скидання URL
        }
    };

    const handleDeleteTab = (index, isPinned) => {
        if (isPinned) {
            setPinnedTabs((prev) => prev.filter((_, i) => i !== index));
        } else {
            setTabs((prev) => prev.filter((_, i) => i !== index));
        }
    };

    const handleDeleteTabBurger = (index, isPinned) => {
        setBurgerTabs((prev) => prev.filter((_, i) => i !== index));
    }

    const handleTabClick = (tab) => {
        if (activeTab && activeTab.name === tab.name) {
            window.open(tab.url, '_blank');
        }

        setActiveTab(tab);
    };


    const togglePinnedTabsVisibility = () => {
        setShowPinnedTabs((prev) => !prev);
    };

    const handleMouseMove = (e) => {
        if (activeTabInfo) {
            setTooltipPosition({
                top: e.clientY + 10,
                left: e.clientX + 10,
            });
        }

        if (showToggleTooltip) {
            setTooltipPosition({
                top: e.clientY + 10,
                left: e.clientX + 10,
            });
        }
    };

    return (
        <div className="navbar-div-all" onMouseMove={handleMouseMove}>
            <input
                className="input-tab"
                type="text"
                value={newTabName}
                onChange={(e) => setNewTabName(e.target.value)}
                placeholder="Назва нового табу"
            />
            <input
                className="input-tab"
                type="text"
                value={newTabUrl}
                onChange={(e) => setNewTabUrl(e.target.value)}
                placeholder="URL нового табу" // Поле для введення URL
            />
            <button className="button-tab" onClick={handleAddTab}>Додати таб</button>

            <div className="tabs-row">
                <div className="tabs-row-left">
                    <button
                        onMouseEnter={() => setShowToggleTooltip(true)}
                        onMouseLeave={() => setShowToggleTooltip(false)}
                        onClick={togglePinnedTabsVisibility}
                        className="toggle-button"
                    >
                        {showPinnedTabs ? '>' : '<'}
                    </button>

                    {showToggleTooltip && (
                        <div className="tooltip" style={{top: tooltipPosition.top, left: tooltipPosition.left}}>
                            <img
                                src={tabIconleft}
                                alt="Icon"
                                style={{width: '16px', height: '16px', marginRight: '5px', verticalAlign: 'middle'}}
                            />
                            Lagerverwaltung
                        </div>
                    )}

                    {showPinnedTabs && (
                        <div className="tab-container-pin">
                            {pinnedTabs.map((tab, index) => (
                                <div
                                    key={index}
                                    className={`tab pinned ${draggedArray === 'pinned' && draggedIndex === index ? 'dragging' : ''} ${activeTab?.name === tab.name ? 'active' : ''}`}
                                    draggable
                                    onDragStart={() => handleDragStart(index, 'pinned')}
                                    onDrop={(e) => handleDrop(e, index, true)}
                                    onDragOver={handleDragOver}
                                    onContextMenu={(e) => handleRightClick(e, index, pinnedTabs)}
                                    onMouseEnter={() => {
                                        setHoveredIndex(index);
                                        setHoveredArray('pinned');
                                        setActiveTabInfo({ name: tab.name, pinned: true }); // Зміна на tab.name
                                    }}
                                    onMouseLeave={() => {
                                        setHoveredIndex(null);
                                        setHoveredArray(null);
                                        setActiveTabInfo(null);
                                    }}
                                    onClick={() => handleTabClick(tab)} // Додавання функції активації
                                >
                                    {tab.name}
                                    {hoveredIndex === index && hoveredArray === 'pinned' && (
                                        <span className="delete-icon" onClick={() => handleDeleteTab(index, true)}>✖</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="tab-container" ref={tabContainerRef}>
                        {tabs.map((tab, index) => (
                            <div
                                key={index}
                                className={`tab ${draggedArray === 'tabs' && draggedIndex === index ? 'dragging' : ''} ${activeTab?.name === tab.name ? 'active' : ''}`}
                                draggable
                                onDragStart={() => handleDragStart(index, 'tabs')}
                                onDrop={(e) => handleDrop(e, index, false)}
                                onDragOver={handleDragOver}
                                onContextMenu={(e) => handleRightClick(e, index, tabs)}
                                onMouseEnter={() => {
                                    setHoveredIndex(index);
                                    setHoveredArray('tabs');
                                    setActiveTabInfo({ name: tab.name, pinned: false }); // Зміна на tab.name
                                }}
                                onMouseLeave={() => {
                                    setHoveredIndex(null);
                                    setHoveredArray(null);
                                    setActiveTabInfo(null);
                                }}
                                onClick={() => handleTabClick(tab)}
                            >
                                {tab.name}
                                {hoveredIndex === index && hoveredArray === 'tabs' && showBurgerMenu===false &&(
                                    <span className="delete-icon" onClick={() => handleDeleteTab(index, false)}>✖</span>
                                )}
                            </div>
                        ))}
                    </div>

                </div>

                <button
                    className={`toggle-button-right ${showBurgerMenu ? 'open' : ''}`}
                    ref={toggleBurgerMenuRef}
                    onClick={toggleBurgerMenu}
                >
                    {showBurgerMenu ? '\\/' : '/\\'}
                </button>

                {activeTabInfo && (
                    <div className="tooltip" style={{ top: tooltipPosition.top, left: tooltipPosition.left }}>
                        <img
                            src={tabIcon}
                            alt="Icon"
                            style={{ width: '16px', height: '16px', marginRight: '5px', verticalAlign: 'middle' }}
                        />
                        {activeTabInfo.pinned ? 'Tab Pinned' : 'Tab Unpinned'}
                    </div>
                )}
            </div>

            {showBurgerMenu && (
                <div className="burger-menu" ref={burgerMenuRef}>
                    {burgerTabs.map((tab, index) => (
                            <div
                                key={index}
                                className={`tab ${activeTab?.name === tab.name ? 'active' : ''}`}

                                onContextMenu={(e) => handleBurgerRightClick(e, index)}
                                onMouseEnter={() => {
                                    setHoveredIndex(index);
                                    setHoveredArray('tabs');
                                    setActiveTabInfo({name: tab.name, pinned: false}); // Зміна на tab.name
                                }}
                                onMouseLeave={() => {
                                    setHoveredIndex(null);
                                    setHoveredArray(null);
                                    setActiveTabInfo(null);
                                }}
                                onClick={() => handleTabClick(tab)}
                            >
                                {tab.name}
                                {hoveredIndex === index && hoveredArray === 'tabs' && (
                                    <span className="delete-icon" onClick={() => handleDeleteTabBurger(index, false)}>✖</span>
                                )}
                            </div>
                    ))}
                </div>
            )}

        </div>
    );
};

export default Tabs;

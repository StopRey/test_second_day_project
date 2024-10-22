import React, { useEffect, useState } from 'react';
import './tabs.css';

const Tabs = () => {
    const [tabs, setTabs] = useState([]);
    const [pinnedTabs, setPinnedTabs] = useState([]);
    const [newTabName, setNewTabName] = useState('');
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [draggedArray, setDraggedArray] = useState(null); // Додати для відстеження масиву
    const [changed, setChanged] = useState(false);

    // Завантаження табів з localStorage
    useEffect(() => {
        const savedTabs = JSON.parse(localStorage.getItem('tabs')) || [];
        const savedPinnedTabs = JSON.parse(localStorage.getItem('pinnedTabs')) || [];

        setTabs(savedTabs);
        setPinnedTabs(savedPinnedTabs);
        setChanged(true);
    }, []);

    // Збереження табів в localStorage
    useEffect(() => {
        if (changed) {
            localStorage.setItem('tabs', JSON.stringify(tabs));
            localStorage.setItem('pinnedTabs', JSON.stringify(pinnedTabs));
        }
    }, [changed, tabs, pinnedTabs]);

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

    const handleAddTab = () => {
        if (newTabName.trim()) {
            setTabs((prev) => [...prev, newTabName]);
            setNewTabName('');
        }
    };

    return (
        <div className="navbar-div-all">
            <input
                className="input-tab"
                type="text"
                value={newTabName}
                onChange={(e) => setNewTabName(e.target.value)}
                placeholder="Назва нового табу"
            />
            <button className="button-tab" onClick={handleAddTab}>Додати таб</button>

            <div className="tabs-row">
                <div className="tab-container-pin">
                    {pinnedTabs.map((tab, index) => (
                        <div
                            key={index}
                            className={`tab pinned ${draggedArray === 'pinned' && draggedIndex === index ? 'dragging' : ''}`}
                            draggable
                            onDragStart={() => handleDragStart(index, 'pinned')}
                            onDrop={(e) => handleDrop(e, index, true)}
                            onDragOver={handleDragOver}
                            onContextMenu={(e) => handleRightClick(e, index, pinnedTabs)}
                        >
                            {tab}
                        </div>
                    ))}
                </div>
                <div className="tab-container">
                    {tabs.map((tab, index) => (
                        <div
                            key={index}
                            className={`tab ${draggedArray === 'tabs' && draggedIndex === index ? 'dragging' : ''}`}
                            draggable
                            onDragStart={() => handleDragStart(index, 'tabs')}
                            onDrop={(e) => handleDrop(e, index, false)}
                            onDragOver={handleDragOver}
                            onContextMenu={(e) => handleRightClick(e, index, tabs)}
                        >
                            {tab}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Tabs;

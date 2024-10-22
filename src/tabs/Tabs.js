import React, { useEffect, useState } from 'react';
import './tabs.css';

const Tabs = () => {
    const [tabs, setTabs] = useState([]);
    const [pinnedTabs, setPinnedTabs] = useState([]);
    const [newTabName, setNewTabName] = useState('');
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [changed, setChanged] = useState(false);

    // Завантаження табів з localStorage
    useEffect(() => {
        const savedTabs = JSON.parse(localStorage.getItem('tabs')) || [];
        const savedPinnedTabs = JSON.parse(localStorage.getItem('pinnedTabs')) || [];

        setTabs(savedTabs);
        setPinnedTabs(savedPinnedTabs);

        setChanged(true)
    }, []);

    // Збереження табів в localStorage
    useEffect(() => {
        if (changed) {
            localStorage.setItem('tabs', JSON.stringify(tabs));
            localStorage.setItem('pinnedTabs', JSON.stringify(pinnedTabs));
        }
    }, [changed, tabs, pinnedTabs]);

    const handleDragStart = (index) => {
        setDraggedIndex(index);
    };

    const handleDrop = (e, targetIndex, isPinned) => {
        e.preventDefault();
        const draggedTab = isPinned ? pinnedTabs[draggedIndex] : tabs[draggedIndex];

        if (isPinned) {
            setPinnedTabs((prev) => {
                const newPinned = [...prev];
                newPinned.splice(draggedIndex, 1); // Видаляємо з попередньої позиції
                newPinned.splice(targetIndex, 0, draggedTab); // Додаємо на нову позицію
                return newPinned;
            });
        } else {
            setTabs((prev) => {
                const newTabs = [...prev];
                newTabs.splice(draggedIndex, 1); // Видаляємо з попередньої позиції
                newTabs.splice(targetIndex, 0, draggedTab); // Додаємо на нову позицію
                return newTabs;
            });
        }
        setDraggedIndex(null); // Скидаємо індекс перетягнутого табу
    };

    const handleDragOver = (e) => {
        e.preventDefault(); // Дозволяємо скидання
    };

    const handleRightClick = (e, index, sourceArray) => {
        e.preventDefault();
        const tabToPin = sourceArray[index];

        if (sourceArray === tabs) {
            setChanged(false);
            setPinnedTabs((prev) => [...prev, tabToPin]);
            setTabs((prev) => prev.filter((_, i) => i !== index)); // Видаляємо таб з незакріплених
            setChanged(true);
        } else {
            setChanged(false);
            setTabs((prev) => [...prev, tabToPin]);
            setPinnedTabs((prev) => prev.filter((_, i) => i !== index)); // Видаляємо таб з закріплених
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
        <div>
            <div className="tab-container">
                {pinnedTabs.map((tab, index) => (
                    <div
                        key={index}
                        className="tab pinned"
                        draggable
                        onDragStart={() => handleDragStart(index)}
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
                        className="tab"
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDrop={(e) => handleDrop(e, index, false)}
                        onDragOver={handleDragOver}
                        onContextMenu={(e) => handleRightClick(e, index, tabs)}
                    >
                        {tab}
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={newTabName}
                onChange={(e) => setNewTabName(e.target.value)}
                placeholder="Назва нового табу"
            />
            <button onClick={handleAddTab}>Додати таб</button>
        </div>
    );
};

export default Tabs;

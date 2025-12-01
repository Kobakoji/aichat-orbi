import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { EntryButton } from './EntryButton';
import { MiniChatWindow } from './MiniChatWindow';
import { FullScreenChat } from './FullScreenChat';
import { ReportViewer } from './ReportViewer';
import { useOrbiStore } from '@/store/useOrbiStore';

export const OrbiWidget = () => {
    const { mode } = useOrbiStore();
    const [showReport, setShowReport] = useState(false);

    return (
        <>
            <EntryButton />
            <AnimatePresence>
                {mode === 'mini' && <MiniChatWindow />}
                {mode === 'full' && <FullScreenChat />}
            </AnimatePresence>
            {showReport && <ReportViewer onClose={() => setShowReport(false)} />}
        </>
    );
};

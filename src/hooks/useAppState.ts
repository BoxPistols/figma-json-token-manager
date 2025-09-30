import { useState, useEffect } from 'react';
import { TokenData, FlattenedToken, ImportError } from '../types';
import { initialMockData } from '../data/initialMockData';
import {
  saveTokensToStorage,
  loadTokensFromStorage,
} from '../utils/tokenUtils';

export function useAppState() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const stored = localStorage.getItem('darkMode');
    return stored ? JSON.parse(stored) : true;
  });

  const [tokens, setTokens] = useState<TokenData>(() => {
    const storedTokens = loadTokensFromStorage();
    return storedTokens && Object.keys(storedTokens).length > 0
      ? storedTokens
      : initialMockData;
  });

  const [showExampleData, setShowExampleData] = useState(() => {
    const storedTokens = loadTokensFromStorage();
    return false; // Don't show example data message since we have initial mock data
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedToken, setSelectedToken] = useState<FlattenedToken | null>(
    null
  );
  const [error, setError] = useState<ImportError | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'standard' | 'compact' | 'table'>(
    'standard'
  );
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: '', message: '', onConfirm: () => {} });
  const [isBulkDeleteMode, setIsBulkDeleteMode] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(
    new Set()
  );
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set());

  // Dark mode effect
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Save tokens to storage effect
  useEffect(() => {
    if (Object.keys(tokens).length > 0) {
      saveTokensToStorage(tokens);
    }
  }, [tokens]);

  // Scroll to top effect
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return {
    // State
    isDarkMode,
    setIsDarkMode,
    tokens,
    setTokens,
    showExampleData,
    setShowExampleData,
    searchQuery,
    setSearchQuery,
    selectedToken,
    setSelectedToken,
    error,
    setError,
    isExportModalOpen,
    setIsExportModalOpen,
    isPasteModalOpen,
    setIsPasteModalOpen,
    isHelpModalOpen,
    setIsHelpModalOpen,
    viewMode,
    setViewMode,
    isSearchFocused,
    setIsSearchFocused,
    confirmDialog,
    setConfirmDialog,
    isBulkDeleteMode,
    setIsBulkDeleteMode,
    showScrollToTop,
    collapsedGroups,
    setCollapsedGroups,
    selectedTypes,
    setSelectedTypes,
    // Actions
    scrollToTop,
  };
}

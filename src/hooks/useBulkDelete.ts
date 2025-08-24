import { FlattenedToken } from '../types';

export function useBulkDelete(
  setConfirmDialog: (dialog: {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }) => void,
  setIsBulkDeleteMode: (mode: boolean) => void
) {
  const handleBulkDelete = (
    tokensToDelete: FlattenedToken[],
    performTokenDelete: (token: FlattenedToken) => void
  ) => {
    setConfirmDialog({
      isOpen: true,
      title: '一括削除確認',
      message: `${tokensToDelete.length} 個のトークンを削除してもよろしいですか？この操作は元に戻せません。`,
      onConfirm: () => {
        tokensToDelete.forEach((token) => performTokenDelete(token));
        setIsBulkDeleteMode(false);
      },
    });
  };

  return {
    handleBulkDelete,
  };
}

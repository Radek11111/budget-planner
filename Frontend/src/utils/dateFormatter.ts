export const formatDate = (dateStr: string | Date) =>
  new Date(dateStr).toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })

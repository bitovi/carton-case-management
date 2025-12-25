/**
 * Generates initials from a name (e.g., "Alex Morgan" -> "AM")
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Gets a consistent background color class for an avatar based on name
 */
export function getAvatarColor(name: string): string {
  const colors = ['bg-blue-100', 'bg-green-100', 'bg-purple-100', 'bg-pink-100'];
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

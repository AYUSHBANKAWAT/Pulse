import Ionicons from '@expo/vector-icons/Ionicons';
import { type IconProps } from '@expo/vector-icons/build/createIconSet';
import { type ComponentProps } from 'react';

export function TabBarIcon({ style, ...rest }: IconProps<ComponentProps<typeof Ionicons>['name']>) {
  // You can explore other icon families like FontAwesome here if you prefer
  return <Ionicons size={28} style={[{ marginBottom: -3 }, style]} {...rest} />;
}
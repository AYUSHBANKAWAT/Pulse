import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';
import { StyledText } from './StyledText';

export interface DropdownOption {
  label: string;
  value: any;
}

interface StyledDropdownProps {
  options: DropdownOption[];
  placeholder?: string;
  onSelect: (option: DropdownOption) => void;
  selectedValue?: any;
  style?: any;
}

export function StyledDropdown({
  options,
  placeholder = 'Select an option...',
  onSelect,
  selectedValue,
  style,
}: StyledDropdownProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');
  const cardBackgroundColor = useThemeColor({}, 'cardBackground');
  const pressedColor = useThemeColor({}, 'background');

  const selectedOption = options.find((option) => option.value === selectedValue);

  const handleSelect = (option: DropdownOption) => {
    onSelect(option);
    setModalVisible(false);
  };

  return (
    <>
      <Pressable
        style={[styles.dropdownButton, { borderColor, backgroundColor: cardBackgroundColor }, style]}
        onPress={() => setModalVisible(true)}>
        <StyledText style={[styles.dropdownButtonText, { opacity: selectedOption ? 1 : 0.5 }]}>
          {selectedOption ? selectedOption.label : placeholder}
        </StyledText>
        <Ionicons name="chevron-down" size={20} color={textColor} />
      </Pressable>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}>
          <View style={[styles.modalContent, { backgroundColor: cardBackgroundColor }]}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value.toString()}
              renderItem={({ item }) => (
                <Pressable
                  style={({ pressed }) => [
                    styles.optionItem,
                    { borderBottomColor: borderColor },
                    { backgroundColor: pressed ? pressedColor : 'transparent' },
                  ]}
                  onPress={() => handleSelect(item)}>
                  <StyledText style={styles.optionText}>{item.label}</StyledText>
                </Pressable>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginVertical: 8,
  },
  dropdownButtonText: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    maxHeight: '50%',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  optionItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optionText: {
    fontSize: 16,
  },
});
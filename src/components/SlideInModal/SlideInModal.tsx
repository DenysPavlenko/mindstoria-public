import React from "react";
import { Modal, Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SlideInView, SlideInViewProps } from "../SlideInView/SlideInView";

const isAndroid = Platform.OS === "android";

export const SlideInModal = (props: SlideInViewProps) => {
  const renderContent = () => {
    if (isAndroid) {
      // Fix for Android devices
      return (
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SlideInView {...props} />
        </GestureHandlerRootView>
      );
    }
    return <SlideInView {...props} />;
  };

  return (
    <Modal
      visible={props.visible}
      transparent
      animationType="fade"
      onRequestClose={props.onClose}
    >
      {renderContent()}
    </Modal>
  );
};

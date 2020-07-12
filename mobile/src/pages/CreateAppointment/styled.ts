import styled, { css } from 'styled-components/native';
import { Platform } from 'react-native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import { FlatList, RectButton } from 'react-native-gesture-handler';
import ProviderDTO from '../Dashboard/dtos/ProviderDTO';

interface ProviderContainerProps {
  isCurrent: boolean;
}

interface ProviderNameProps {
  isCurrent: boolean;
}

export const Container = styled.View`
  flex: 1;
`;

export const Header = styled.View`
  padding: 24px;
  ${Platform.OS === 'ios' &&
  css`
    padding-top: ${getStatusBarHeight() + 24}px;
  `}
  background: #28262e;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const BackButton = styled.TouchableOpacity``;

export const HeaderTitle = styled.Text`
  color: #f4ede8;
  font-family: 'RobotoSlab-Medium';
  line-height: 28px;
  font-size: 20px;
  margin-left: 16px;
`;

export const UserAvatar = styled.Image`
  width: 56px;
  height: 56px;
  border-radius: 28px;
  margin-left: auto;
`;

export const ProvidersListContainer = styled.View`
  height: 112px;
`;

export const ProvidersList = styled(
  FlatList as new () => FlatList<ProviderDTO>,
)`
  padding: 32px 24px;
`;

export const ProviderContainer = styled(RectButton)<ProviderContainerProps>`
  background: ${props => (props.isCurrent ? '#ff9000' : '#3e3b47')};
  flex-direction: row;
  align-items: center;
  border-radius: 8px;
  padding: 8px 12px;
  margin-right: 16px;
`;

export const ProviderAvatar = styled.Image`
  width: 32px;
  height: 32px;
  border-radius: 16px;
`;

export const ProviderName = styled.Text<ProviderNameProps>`
  color: ${props => (props.isCurrent ? '#232129' : '#f4ede8')};
  font-family: 'RobotoSlab-Medium';
  font-size: 18px;
  margin-left: 16px;
`;

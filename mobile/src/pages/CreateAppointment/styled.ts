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

interface HourProps {
  isAvailable: boolean;
  isSelected: boolean;
}

interface HourTextProps {
  isSelected: boolean;
  isAvailable: boolean;
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

export const Content = styled.ScrollView``;

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

export const Calendar = styled.View``;

export const CalendarTitle = styled.Text`
  font-family: 'RobotoSlab-Medium';
  color: #f4ede8;
  font-size: 24px;
  margin: 0 24px 24px;
`;

export const OpenCalendarButton = styled(RectButton)`
  height: 46px;
  background: #ff9000;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  margin: 0 24px;
`;

export const OpenCalendarButtonText = styled.Text`
  font-family: 'RobotoSlab-Medium';
  color: #232129;
  font-size: 18px;
`;

export const Schedule = styled.View`
  padding: 24px 0 16px;
`;

export const ScheduleTitle = styled.Text`
  color: #f4ede8;
  font-family: 'RobotoSlab-Medium';
  line-height: 28px;
  font-size: 20px;
  margin: 0 24px 12px;
`;

export const Section = styled.View`
  margin-bottom: 24px;
`;

export const SectionTitle = styled.Text`
  color: #999591;
  font-family: 'RobotoSlab-Regular';
  font-size: 18px;
  margin: 0 24px 12px;
`;

export const SectionContent = styled.ScrollView.attrs({
  horizontal: true,
  contentContainerStyle: { paddingHorizontal: 24 },
  showsHorizontalScrollIndicator: false,
})``;

export const Hour = styled(RectButton)<HourProps>`
  background: ${props =>
    props.isSelected && props.isAvailable ? '#ff9000' : '#3e3b47'};
  flex-direction: row;
  align-items: center;
  border-radius: 8px;
  padding: 12px;
  margin-right: 8px;
  opacity: ${props => (props.isAvailable ? 1 : 0.3)};
`;

export const HourText = styled.Text<HourTextProps>`
  color: ${props =>
    props.isSelected && props.isAvailable ? '#232129' : '#f4ede8'};
  font-family: 'RobotoSlab-Regular';
  font-size: 16px;
`;

export const CreateAppointmentButton = styled(RectButton)`
  height: 50px;
  background: #ff9000;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  margin: 0 24px 24px;
`;

export const CreateAppointmentButtonText = styled.Text`
  font-family: 'RobotoSlab-Medium';
  color: #232129;
  font-size: 18px;
`;

import { StyleSheet, Text, View, Dimensions, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { RootStackParamList } from '../AppNavigator'
import { RootState } from '../authentication/store';
import { useSelector } from 'react-redux';
import RoundedImage from '../components/RoundedImage';
import RoundedBox from '../components/RoundedBox';
import ChangePasswordBottomSheet from './ChangePasswordBottomSheet';
import Icon from 'react-native-vector-icons/MaterialIcons'; 

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

const ProfileScreen: React.FC<Props> = ({ navigation, route }) => {
    const [isModalVisible, setModalVisible] = useState(false);
    const user = useSelector((state: RootState) => state.auth.user);
    console.log("User data:", user);
    const handleBackPress = () => {
        navigation.goBack();
    }
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    return (

        <View>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBackPress}>
                <Icon name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.text}>Profile</Text>
            </View>
            <View>
                <RoundedImage
                    image='https://i.pinimg.com/564x/25/3e/9f/253e9fef6dddf163aa57f436ee35ca5d.jpg' />
                <Text style={styles.profileText}>User Name</Text>
                <RoundedBox
                    image='https://i.pinimg.com/564x/84/6a/03/846a03c6760f83f3a0e92609bca9cebf.jpg'
                    text={user?.email} />
                <Text style={styles.profileText}>Full Name</Text>
                <RoundedBox
                    image='https://i.pinimg.com/564x/88/54/80/885480f77f921fad94ce6388099b8d7e.jpg'
                    text={user?.name} />
                <Text style={styles.profileText}>Contact Number</Text>
                <RoundedBox
                    image='https://i.pinimg.com/564x/a0/60/17/a06017e57bc5799e41380d162c6aabb7.jpg'
                    text={user?.phone} />
                <TouchableOpacity onPress={toggleModal}>
                    <Text style={styles.changePassword}>Change Password ?</Text>
                </TouchableOpacity>
                <ChangePasswordBottomSheet isVisible={isModalVisible} onClose={toggleModal} />
            </View>
        </View>
    )
}


export default ProfileScreen;

const styles = StyleSheet.create({
    header: {
        width: Dimensions.get('window').width,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        paddingHorizontal: 16,
        marginTop: 24,
    },
    text: {
        width: Dimensions.get('window').width / 1.3,
        fontSize: 16,
        textAlign: 'center',
        color: '#000000',
        paddingHorizontal: 24,
        fontFamily: 'PlusJakartaSans-SemiBoldItalic'
    },
    profileText: {
        fontSize: 16,
        paddingHorizontal: 24,
        color: '#000000',
        marginTop: 24,
        fontFamily: 'PlusJakartaSans-Italic-VariableFont_wght'
    },
    changePassword: {
        fontSize: 16,
        paddingHorizontal: 24,
        color: 'red',
        marginTop: 24,
        fontFamily: 'PlusJakartaSans-ExtraBold',
    }
})
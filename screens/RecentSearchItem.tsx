import { StyleSheet, View } from 'react-native'
import React from 'react'
import { Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../AppNavigator'
import { Provider } from 'react-redux';
import store from '../recentSearch/store';
import RecentSearchFilter from './RecentSearchFilter';
import { CommonActions } from '@react-navigation/native';


type Props = NativeStackScreenProps<RootStackParamList, 'RecentSearch'>;

const RecentSearchItem: React.FC<Props> = ({ route, navigation }) => {
    const { searchItem } = route.params;
    console.log("Data passed for Recent Search: ", searchItem);
    const handleBackPress = () => {
        navigation.goBack()
    }
    const onReserveClick = ()=>{
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Dashboard' }],
          })
        )
    }
    return (
        <View style={styles.container}>
            <Provider store={store}>
                <RecentSearchFilter
                    searchItem={searchItem}
                    backPress={handleBackPress} 
                    reserveClick = {onReserveClick}/>
            </Provider>
        </View>
    );
}

export default RecentSearchItem;

const styles = StyleSheet.create({
    container: {
        flex:1,
    },
});
import { useLocalSearchParams } from 'expo-router';

export default function TaskScreen() {
    const { id } = useLocalSearchParams();

    return (
        <div>
            Task details page for ID: {id}
        </div>
    );
}
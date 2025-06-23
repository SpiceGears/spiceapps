import { Project } from "@/models/Project"
import { Text, ScrollView } from "react-native"

interface OverviewProps {
    project: Project
}

export default function OverviewTab(props: OverviewProps) {
    return(
          <ScrollView
        className="flex-1 bg-white m-8"
      >
        <Text className="text-2xl mb-5">
          Opis projektu
        </Text>
        <Text className='text-xl'>
          {props.project?.description}
        </Text>
      </ScrollView>
    )
}
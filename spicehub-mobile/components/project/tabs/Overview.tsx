import { Project } from "@/models/Project"
import { Text, ScrollView } from "react-native"

interface OverviewProps {
    project: Project
}

export default function OverviewTab(props: OverviewProps) {
    return(
          <ScrollView
        className="flex-1 bg-light-bg m-8"
      >
        <Text className="text-2xl mb-5 text-light-text">
          Opis projektu
        </Text>
        <Text className='text-xl text-light-text-muted'>
          {props.project?.description}
        </Text>
      </ScrollView>
    )
}
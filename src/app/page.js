import NavigationComponent from "./Components/Navigation/NavigationComponent";
import DocumentosScreen from "./Containers/Documentos/DocumentosScreen";

export default function Home() {
  return (
      <div 
          style={homeContainer}
        >
          <NavigationComponent />
          <DocumentosScreen/>
      </div>
  );
}

const homeContainer = {
  display: 'flex', 
  flexDirection: 'column', 
  gap: '2rem'
}; 
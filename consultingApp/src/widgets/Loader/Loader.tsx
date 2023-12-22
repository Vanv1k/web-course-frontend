import 'semantic-ui-css/components/loader.min.css';
import { Loader as Loading, Container } from 'semantic-ui-react'

const Loader = () => {
    return (
        <div>
            <Container style= {{marginLeft: '50%', marginTop: '21%'}}>
                <Loading active inline />
            </Container>
        </div>
    )
}

export default Loader;
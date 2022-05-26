import Page from '../components/Page';
import React from 'react';
import {
  Card,
  Col,
  Row,
} from 'reactstrap';

class DashboardPage extends React.Component {
  componentDidMount() {
    // this is needed, because InfiniteCalendar forces window scroll
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <Page
        className="DashboardPage"
        title="Inicio"
        step={false}
      // breadcrumbs={[{ name: 'Dashboard', active: true }]}
      >
        <Row>
          <Col lg={12} md={12} sm={12} xs={12}>
            <Card className="align-items-center">
              <Card className="align-items-center p-3 border-0" >
                <label>Bienvenidos a <strong>faDocs</strong></label>
                <label>"Documentos fáciles"</label>
                <label className='text text-center col-md-8'>
                  Con esta herramienta, podrás subir documentos y llenar de una forma muy fácil las etiquetas que contengan.
                </label>
              </Card>
            </Card>
          </Col>
        </Row>
      </Page>
    );
  }
}
export default DashboardPage;

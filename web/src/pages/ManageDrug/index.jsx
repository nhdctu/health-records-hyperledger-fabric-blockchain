import React, { useState, useEffect } from 'react';
import {
    Card,
    Table,
    Row,
    Col,
    Divider,
    Button,
    Space,
    Modal,
    Tag,
    message
} from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import axios from 'axios';
import moment from 'moment';
import { PlusOutlined } from '@ant-design/icons';
import {fetchCurrentUser} from '@/helpers/Auth'
import { DEFAULT_HOST } from '@/host';
import EditDrugForm from './Components/EditDrugForm';
import DrugForm from './Components/DrugForm';

moment.locale('en');

// const { Search } = Input;
// const { Option } = Select;


export default () => {
    const [up, setUp] = useState(false);
    const [formVisible, setFormVisible] = useState(false);
    const [editRow, setEditRow] = useState({});
    const [drugData, setDrugData] = useState([]);
    const [editDrug, setEditDrug] = useState(false);
    const [tloading, setTloading] = useState(true);
    const user = fetchCurrentUser();
    const config = {
        headers: {
            Authorization: `Bearer ${user.token}`,
        },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const fetchDrug = async () => {
            try {
                setTloading(true);
                const url = `${DEFAULT_HOST}/admin/drug`;
                const result = await axios.get(url, config);
                return result.data;
            } catch (error) {
                // console.log(error);
            }
            return "";
    };
    useEffect(() => {
        const f = async () => {
            const drug = await fetchDrug();
            setDrugData(drug);
            setTloading(false);
            return "";
        };
        f();
    }, [editDrug, formVisible, up]);

    const handleEditClick = (record) => {
        setEditRow(record);
        setEditDrug(true);
    }

    const handleEditIsDeleted = async (Id) => {
        setUp(true);
        const url = `${DEFAULT_HOST}/admin/drug-delete/${Id}`;
        const data = {};
            try {
                const result = await axios.post(url, data,config);
                if(result.data.success){
                  message.success("???? c???p nh???t");
                  setUp(false);
                }
                else {
                  message.error("Th???t b???i");
                }
            } catch (error) {
              message.error("Th???t b???i");
            }
      };

      const handleEditIsActived = async (Id) => {
        setUp(true);
        const url = `${DEFAULT_HOST}/admin/drug-active/${Id}`;
        const data = {};
            try {
                const result = await axios.post(url, data ,config);
                if(result.data.success){
                  message.success("???? c???p nh???t");
                  setUp(false);
                }
                else {
                  message.error("Th???t b???i");
                }
            } catch (error) {
              message.error("Th???t b???i");
            }
      }
    const columns = [
        {
            title: 'T??n thu???c',
            key: 'drug_name',
            dataIndex: 'drug_name',
        },
        {
            title: 'D???ng thu???c',
            key: 'drug_dosage_form',
            dataIndex: 'drug_dosage_form',
        },
        {
            title: '????n v??? thu???c',
            key: 'drug_unit',
            dataIndex: 'drug_unit',
        },
        {
            title: '???????ng d??ng',
            key: 'drug_route',
            dataIndex: 'drug_route',
        },
        {
            title: 'C??ch d??ng thu???c',
            key: 'drug_instruction',
            dataIndex: 'drug_instruction',
        },
        {
            title: "Tr???ng th??i",
            render: (text, record) => {
                  if (!record.drug_is_deleted)
                      return <Tag color='success'>Ho???t ?????ng</Tag>
                      return <Tag color='warning'>???? kh??a</Tag>
            }  
          },
        {
            title: 'Ch???nh s???a',
            render: (text, record) => {
                if (!record.drug_is_deleted)
                return <><Button type="link" onClick={() => handleEditClick(record)}>Xem chi ti???t</Button><Button type="link" onClick={() => handleEditIsDeleted(record.drug_id)}>Kh??a</Button> </>;
                return <><Button type="link" onClick={() => handleEditIsActived(record.drug_id)}>K??ch ho???t</Button></>;
            },
        },
    ];

    return (
        <PageContainer>
            <Card>
                <Row gutter={1}>
                    <Col span={3}>
                       
                    </Col>
                    <Col span={8}>
                    </Col>
                    <Col offset={5} span={8}>
                        <Space style={{ float: 'right' }}>
                            <Button
                                type="primary"
                                style={{ float: 'right' }}
                                onClick={() => setFormVisible(true)}
                            >
                                <PlusOutlined />
                                Th??m thu???c
                            </Button>
                        </Space>
                    </Col>
                </Row>
                <Divider></Divider>
                <Table loading={tloading} dataSource={drugData} columns={columns} pagination={{pageSize:6}}></Table>
            </Card>
            <Modal
                centered
                title="Th??m thu???c"
                visible={formVisible}
                footer={null}
                onCancel={() => setFormVisible(false)}
                destroyOnClose
            >
                <DrugForm onCancel={() => setFormVisible(false)} />
            </Modal>
            <Modal
                centered
                title="Ch???nh s???a thu???c"
                footer={null}
                visible={editDrug}
                onCancel={() =>  setEditDrug(false)}
                destroyOnClose
            >
                <EditDrugForm onCancel={() => setEditDrug(false)} defaultValue={editRow} />
            </Modal>
        </PageContainer>
    );
};
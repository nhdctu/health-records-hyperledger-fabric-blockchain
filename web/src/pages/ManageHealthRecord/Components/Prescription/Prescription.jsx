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
    message,
    // Tag
} from 'antd';
// import { PageContainer } from '@ant-design/pro-layout';
import axios from 'axios';
import moment from 'moment';
import { PlusOutlined } from '@ant-design/icons';
import {fetchCurrentUser} from '@/helpers/Auth'
import { DEFAULT_HOST } from '@/host';
// import EditDrugForm from './EditDrugForm';
import DrugForm from './DrugForm';

moment.locale('en');

// const { Search } = Input;
// const { Option } = Select;


export default ({mbId}) => {
    const [formVisible, setFormVisible] = useState(false);
    // const [editRow, setEditRow] = useState({});
    const [drugData, setDrugData] = useState([]);
    // const [editDrug, setEditDrug] = useState(false);
    const [tloading, setTloading] = useState(true);
    const user = fetchCurrentUser();
    const config = {
        headers: {
            Authorization: `Bearer ${user.token}`,
        },
    };

    const fetchDrug = async () => {
            try {
                setTloading(true);
                const url = `${DEFAULT_HOST}/physician/search-prescription?field=prescription_medical_bill_id&value=${mbId}`;  // prescription`
                const result = await axios.get(url, config);
                return result.data.data;
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
    }, [formVisible]);

    const handleDeleteClick = async (record) => {
        try {
            setTloading(true);
            const pId = record.prescription_id;
            const url = `${DEFAULT_HOST}/physician/delete/${pId}`; 
            const result = await axios.get(url, config);
            if(result.data.success){
                message.success("???? x??a th??nh c??ng");
                setTloading(false);
                const f = async () => {
                    const drug = await fetchDrug();
                    setDrugData(drug);
                    setTloading(false);
                    return "";
                };
                f();
                return "";
            } 
            message.error("X??a kh??ng th??nh c??ng");
            setTloading(false);
            return "";

        } catch (error) {
            message.error("X??a kh??ng th??nh c??ng");
            setTloading(false);
            return "";
        }
    }
    const columns = [
        {
            title: 'T??n thu???c',
            key: 'prescription_drug_name',
            dataIndex: 'prescription_drug_name',
        },
        {
            title: 'D???ng thu???c',
            key: 'prescription_drug_dosage_form',
            dataIndex: 'prescription_drug_dosage_form',
        },
        {
            title: '????n v??? thu???c',
            key: 'prescription_drug_unit',
            dataIndex: 'prescription_drug_unit',
        },
        {
            title: '???????ng d??ng',
            key: 'prescription_drug_route',
            dataIndex: 'prescription_drug_route',
        },
        {
            title: 'C??ch d??ng thu???c',
            key: 'prescription_drug_instruction',
            dataIndex: 'prescription_drug_instruction',
        },
        {
            title: 'S??? l?????ng thu???c',
            key: 'drug_numbers',
            dataIndex: 'drug_numbers',
        },
        {
            title: 'Ch??? ?????nh c???a b??c s??',
            key: 'prescription_doctor_instruction',
            dataIndex: 'prescription_doctor_instruction',
        },
        {
            title: 'Ch???nh s???a',
            render: (text, record) => {
                return <Button type="link" onClick={() => handleDeleteClick(record)}>X??a</Button>;
            },
        },
    ];

    return (
        <>
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
                <DrugForm onCancel={() => setFormVisible(false)} mbId={mbId}/>
            </Modal>
            {/* <Modal
                centered
                title="Ch???nh s???a thu???c"
                footer={null}
                visible={editDrug}
                onCancel={() =>  setEditDrug(false)}
                destroyOnClose
            >
                <EditDrugForm onCancel={() => setEditDrug(false)} defaultValue={editRow} />
            </Modal> */}
       </>
    );
};
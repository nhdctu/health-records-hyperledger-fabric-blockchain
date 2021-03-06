import React, {useState, useEffect} from 'react';
import {Form, Input, Button, Result, Space, message, Card, Tag, Divider, DatePicker} from 'antd';
import {RetweetOutlined} from '@ant-design/icons'
import 'moment/locale/en-au';
import moment from 'moment';
import axios from 'axios';
import { DEFAULT_HOST } from '@/host';
import Modal from 'antd/lib/modal/Modal';
import {fetchCurrentUser} from '@/helpers/Auth';
import Prescription from './Prescription/Prescription';
import SubclinicalSheet from './Subclinical/SubclinicalSheet';

const layout = {
    wrapperCol: {
        span: 16
    },
    labelCol: {
        span: 8
    }
}

const buttonCol = {
    wrapperCol: {
        span: 16,
        offset: 8
    }
}

export default ({mbValue}) => {
    const [success, setSuccess] = useState(false);
    const [anamnesis, setAnamnesis] = useState('');
    const [histotyId, setId] = useState('');
    const [medicalHistory, setHistory] = useState('');
    const [posting, setPosting] = useState(false);
    const [form] = Form.useForm();
    const [comp, setComp] = useState(mbValue.medical_bill_is_completed);
    const config = {};
            const user = fetchCurrentUser();
            config.headers = {
                    Authorization: `Bearer ${user.token}`
                };
    useEffect(()=>{
        const f = async () => {
            const url = `${DEFAULT_HOST}/physician/search-history?field=history_patient_id&value=${mbValue.medical_bill_patient_id}`;
            try {
                const result = await axios.get(url, config);
                if (result.data.success) { 
                    setAnamnesis(result.data.data[0].anamnesis);
                    setHistory(result.data.data[0].medical_history);
                    setId(result.data.data[0].history_id);

                };
            } catch (error) {
                setAnamnesis('');
                setHistory('');
                setId('');
            }
            const mb = mbValue;
            mb.medical_bill_anamnesis = anamnesis;
            mb.medical_bill_medical_history = medicalHistory;
            if(mb.medical_bill_appointment === undefined) {
                form.setFieldsValue(mb);
            }
            else {
                mb.medical_bill_appointment = moment(mb.medical_bill_appointment, 'DD-MM-YYYY');
                form.setFieldsValue(mb);
            }
            
            return "";
        }
        f();
    },[form, posting, anamnesis, histotyId, medicalHistory]);
    
    const handleFormFinish = async (value) => {
        setPosting(true);
        const va = value;
        va.medical_bill_is_completed = comp;
        va.medical_bill_id = mbValue.medical_bill_id;
        // va.medical_bill_anamnesis = anamnesis;
        // va.medical_bill_medical_history = medicalHistory;
        va.medical_bill_appointment =  va.medical_bill_appointment.format('DD-MM-YYYY');
        const url = `${DEFAULT_HOST}/physician/medical-bill/${va.medical_bill_id}/${histotyId}`;
        try {
            const result = await axios.post(url, va, config);
            if (result.data.success) { setPosting(false); setSuccess(true); message.success("Th??nh c??ng"); return};
            setPosting(false); 
            setSuccess(false); 
            message.error('Th???t b???i!');
            return;
        } catch (error) {
            setPosting(false);
            setSuccess(false); 
            message.error('Th???t b???i!');
        }
    };;

    return (
        <Card>
        <Form
            autoComplete="off"
            labelAlign="left"
            {...layout}
            onFinish={handleFormFinish}
            form={form}
            style={{margin:20}}
        >
            <Card>
                <Tag color='cyan'>Th??ng tin h??nh ch??nh</Tag>
                <Divider></Divider>
                
                <Form.Item
                    hasFeedback
                    name="medical_bill_patient_id"
                    label="ID b???nh nh??n"
                    rules={[
                        {required: true},
                    ]}
                >
                    <Input readOnly disabled={posting}></Input>
                </Form.Item>
                <Form.Item
                    hasFeedback
                    name="medical_bill_patient_name"
                    label="H??? t??n b???nh nh??n"
                    rules={[
                        {required: true},
                    ]}
                >
                    <Input readOnly disabled={posting}></Input>
                </Form.Item>
                <Form.Item
                    hasFeedback
                    label="ID s??? kh??m b???nh"
                    name="medical_bill_health_record_id"
                    rules={[
                        {required: true},
                    ]}
                    
                >
                    <Input readOnly disabled={posting}></Input>
                </Form.Item>
                <Form.Item
                    hasFeedback
                    label="S??? BHYT"
                    name="medical_bill_health_insurance"
                    rules={[
                        {required: true},
                    ]}
                    
                >
                    <Input readOnly disabled={posting}></Input>
                </Form.Item>
                <Form.Item
                    hasFeedback
                    label="S??? th??? t??? kh??m"
                    name="medical_bill_ordinal_number"
                    rules={[
                        {required: true},
                    ]}
                    
                >
                    <Input readOnly disabled={posting}></Input>
                </Form.Item>
                <Form.Item
                    hasFeedback
                    label="Khoa"
                    name="medical_bill_department_name"
                    rules={[{ required: true }]}
                >
                    <Input readOnly disabled={posting}></Input>
                </Form.Item>
                <Form.Item
                    hasFeedback
                    label="Ph??ng"
                    name="medical_bill_room_name"
                    rules={[{ required: true}]}
                >
                    <Input readOnly disabled={posting}></Input>
                </Form.Item>
                <Form.Item
                    label="B??c s??"
                    hasFeedback
                    name="medical_bill_physician_name"
                    rules={[{ required: true}]}
                >
                    <Input readOnly disabled={posting}></Input>
                </Form.Item>
            </Card>
            <Card>
                <Tag color='cyan'>D???u hi???u sinh t???n</Tag>
                <Divider></Divider>
                <Form.Item
                    label="Nhi???t ????? (????n v???: ????? C )"
                    hasFeedback
                    name="vital_signs_temperature"
                    rules={[{ required: true}]}
                >
                    <Input disabled={posting}></Input>
                </Form.Item>
                <Form.Item
                    label="Huy???t ??p (????n v???: mmHg )"
                    hasFeedback
                    name="vital_signs_blood_pressure"
                    rules={[{ required: true}]}
                >
                    <Input disabled={posting}></Input>
                </Form.Item>
                <Form.Item
                    label="Nh???p th??? (????n v???: nh???p/ph??t )"
                    hasFeedback
                    name="vital_signs_breathing"
                    rules={[{ required: true}]}
                >
                    <Input disabled={posting}></Input>
                </Form.Item>
                <Form.Item
                    label="Nh???p tim (????n v???: nh???p/ph??t )"
                    hasFeedback
                    name="vital_signs_pluse"
                    rules={[{ required: true}]}
                >
                    <Input disabled={posting}></Input>
                </Form.Item>
            </Card>
            <Card>
                <Tag color='cyan'>Th??ng tin th??m kh??m b???nh</Tag>
                <Divider></Divider>
                <Form.Item
                    label="L?? do kh??m b???nh"
                    hasFeedback
                    name="medical_bill_reason_for_examination"
                    rules={[{ required: true}]}
                >
                    <Input disabled={posting}></Input>
                </Form.Item>
                <Form.Item
                    label="Ti???n s??? b???nh"
                    hasFeedback
                    name="medical_bill_anamnesis"
                    rules={[{ required: true}]}
                >
                    <Input disabled={posting}></Input>
                </Form.Item>
                <Form.Item
                    label="L???ch s??? b???nh"
                    hasFeedback
                    name="medical_bill_medical_history"
                    rules={[{ required: true}]}
                >
                    <Input disabled={posting}></Input>
                </Form.Item>
                {/* <Form.Item
                    label="K???t qu??? tr?????c ????y"
                    hasFeedback
                    name="medical_bill_previous_result"
                    rules={[{ required: true}]}
                >
                    <Input disabled={posting}></Input>
                </Form.Item> */}
                <Form.Item
                    label="Ch???n ??o??n b???nh"
                    hasFeedback
                    name="medical_bill_diagnose"
                    rules={[{ required: true}]}
                >
                    <Input disabled={posting}></Input>
                </Form.Item>
                
                {/* <Form.Item
                    label="Ph????ng ph??p ??i???u tr???"
                    hasFeedback
                    name="medical_bill_treatment"
                    rules={[{ required: true}]}
                >
                    <Input disabled={posting}></Input>
                </Form.Item>
                
                <Form.Item
                    label="N??i gi???i thi???u"
                    hasFeedback
                    name="medical_bill_place_of_introduction"
                    rules={[{ required: true}]}
                >
                    <Input disabled={posting}></Input>
                </Form.Item> */}
                <Form.Item
                    label="H???n t??i kh??m"
                    hasFeedback
                    name="medical_bill_appointment"
                    rules={[{ required: true}]}
                >
                    <DatePicker disabled={posting}></DatePicker>
                </Form.Item>
                </Card>
                <Card>
                    <Tag color='cyan'>K???t qu??? c???n l??m s??ng</Tag> 
                    <Divider></Divider>
                    <SubclinicalSheet mbId={mbValue.medical_bill_id}></SubclinicalSheet>
                </Card>
                <Card>
                    <Tag color='cyan'>????n thu???c</Tag> 
                    <Divider></Divider>
                    <Prescription mbId={mbValue.medical_bill_id} ></Prescription>   
                </Card>
                <Divider></Divider>
                <Form.Item name="medical_bill_is_completed" label="Tr???ng th??i:">
                    {comp ? 
                    <Button disabled={posting} onClick={() => {setComp(false)}}>???? ho??n th??nh</Button>:
                    <Button disabled={posting} onClick={() => {setComp(true)}}>Ch??a ho??n th??nh</Button>}
                </Form.Item>
                <Form.Item {...buttonCol}>
                    <Space>
                        <Button type="primary" htmlType="submit" loading={posting}>
                            X??c nh???n
                        </Button>
                        <Button type="default" htmlType="button" disabled={posting}>
                            <RetweetOutlined />
                            L??m l???i
                        </Button>
                    </Space>
                </Form.Item>
            
            <Modal visible={success} footer={null} onCancel={() => setSuccess(false)}>
                <Result
                    status="success"
                    title={'Th??m th??nh c??ng'}
                />
            </Modal>
        </Form>
        </Card>
    );
}


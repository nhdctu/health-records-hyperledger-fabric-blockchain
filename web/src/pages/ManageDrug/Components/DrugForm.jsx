import React, { useState} from 'react';
import { Form, Input, Button, message} from 'antd';
import axios from 'axios';
import { DEFAULT_HOST } from '@/host';
import {fetchCurrentUser} from '@/helpers/Auth'

const {useForm} = Form;
// const Option = Select;, Select, useEffect
                    
export default ({edit }) => {
    // const [drugData, setDrugData] = useState([]);
    // const [formValue, setValue] = useState([]);
    // const [rowValue, setRow] = useState('');disable
    const [loading, setLoading] = useState(false);
    const user = fetchCurrentUser();
    const config = {
        headers: {
            Authorization: `Bearer ${user.token}`,
        }
    }
    const [form] = useForm();
    const validate = async (field, value) => {
        const url = `${DEFAULT_HOST}/admin/validate-drug?field=${field}&value=${value}`;
        try {
            const result = await axios.get(url);
            return result.data.valid;
        } catch (error1) {
            return false;
        }
    }; 
    // const validate1 = async (field, value) => {
    //     const url = `${DEFAULT_HOST}/admin/validate-department?field=${field}&value=${value}`;
    //     try {
    //         const result = await axios.get(url);
    //         return result.data.valid;
    //     } catch (error1) {
    //         return false;
    //     }
    // }; 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // const fetchDepartment = async () => {
    //     try {
    //         const url = `${DEFAULT_HOST}/admin/department`;
    //         const result = await axios.get(url, config);
    //         return result.data;
    //     } catch (error) {
    //         // console.log(error);
    //     }
    //     return "";
    // };
    // useEffect(() => {
    //     const f = async () => {
    //         const department = await fetchDepartment();
    //         setDepartmentData(department);
    //     };
    //     f();
    // },[departmentData, fetchDepartment]);
    const formFinish = async (data) => {
        setLoading(true);
        const url = `${DEFAULT_HOST}/admin/drug`;
        let mess;
        try {
            const result =  await axios.post(url,data, config);
            if (result.status){
                mess = `????ng k?? th??nh c??ng ${data.name}`;
                setLoading(false);
                message.success(mess);
            }
            else { 
                mess = "Th???t b???i";
                setLoading(false);
                message.error(mess);
            }  
        } catch (error2) {
            mess = "Th???t b???i";
            setLoading(false);
            message.error(mess);
        }
        // disable();
        return "";
    }
    return (
        <Form
            labelCol={{ span: 8 }}
            labelAlign="left"
            name="drug"
            onFinish={formFinish}
            form={form}
        >
            <Form.Item 
                name="name"
                label="T??n thu???c"
                hasFeedback
                rules={[
                    { required: true, message: 'Vui l??ng nh???p t??n thu???c' },
                    {
                        validator: async (rule, value) => {
                            if (!(await validate('drug_name', value))) throw  new Error('T??n thu???c ???? t???n t???i');
                        },
                    },
                ]}>
                <Input disabled={loading} placeholder="..."></Input>
            </Form.Item>
            <Form.Item 
                name="dosageForm"
                label="D???ng thu???c"
                hasFeedback
                rules={[
                    { required: true, message: 'Vui l??ng nh???p d???ng thu???c' },
                    
                ]}>
                <Input disabled={loading} placeholder="..."></Input>
            </Form.Item>
            <Form.Item
            name="unit"
            label="????n v??? thu???c"
            hasFeedback
            rules={[
                { required: true, message: 'Vui nh???p ????n v??? thu???c' },
                
            ]}>
                <Input disabled={loading} placeholder="..."></Input>
            </Form.Item>
            <Form.Item
                name="route"
                label="???????ng d??ng"
                hasFeedback
                rules={[
                    { required: true, message: 'Vui nh???p ???????ng d??ng thu???c' },
                    
                ]}
            >
                <Input disabled={loading} placeholder="..."></Input>
            </Form.Item>
            <Form.Item
                name="instruction"
                label="C??ch d??ng thu???c"
                hasFeedback
                rules={[
                    { required: true, message: 'Vui nh???p c??ch d??ng thu???c' },
                    
                ]}
            >
                <Input disabled={loading} placeholder="..."></Input>
            </Form.Item>
            {edit ? (
            <Form.Item wrapperCol={{ offset: 8 }}>
                <Button type="primary" htmlType="submit" loading={loading}>
                    S???a thu???c
                </Button>
            </Form.Item>
            ) : (
            <Form.Item wrapperCol={{ offset: 8 }}>
                <Button type="primary" htmlType="submit" loading={loading}>
                    Th??m thu???c
                </Button>
            </Form.Item>
            )}
        </Form>
    
    );
};

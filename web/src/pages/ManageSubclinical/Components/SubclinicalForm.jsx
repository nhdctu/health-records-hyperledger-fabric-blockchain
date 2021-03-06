import React, { useState} from 'react'; // , useEffect
import { Form, Input, Button, message} from 'antd';
import axios from 'axios';
import { DEFAULT_HOST } from '@/host';
import {fetchCurrentUser} from '@/helpers/Auth'

const {useForm} = Form;
// const Option = Select;, Select
                    
export default ({edit }) => {
    //  const [subclinicalData, setSubclinicalData] = useState([]);
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
        const url = `${DEFAULT_HOST}/admin/validate-subclinical?field=${field}&value=${value}`;
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
    // const fetchSubclinical = async () => {
    //     try {
    //         const url = `${DEFAULT_HOST}/admin/subclinical`;
    //         const result = await axios.get(url, config);
    //         return result.data;
    //     } catch (error) {
    //         // console.log(error);
    //     }
    //     return "";
    // };
    // useEffect(() => {
    //     const f = async () => {
    //         const subclinical = await fetchSubclinical();
    //         setSubclinicalData(subclinical);
    //     };
    //     f();
    // },[loading, form]);
    const formFinish = async (data) => {
        setLoading(true);
        const url = `${DEFAULT_HOST}/admin/subclinical`;
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
            name="subclinical"
            onFinish={formFinish}
            form={form}
        >
            <Form.Item 
                name="name"
                label="T??n c???n l??m s??ng"
                hasFeedback
                rules={[
                    { required: true, message: 'Vui l??ng nh???p t??n c???n l??m s??ng' },
                    {
                        validator: async (rule, value) => {
                            if (!(await validate('subclinical_name', value))) throw  new Error('T??n c???n l??m s??ng ???? t???n t???i');
                        },
                    },
                ]}>
                <Input disabled={loading} placeholder=" ..."></Input>
            </Form.Item>
            <Form.Item
                name="description"
                label="M?? t??? c???n l??m s??ng"
            >
                <Input disabled={loading} placeholder=" ..."></Input>
            </Form.Item>
            {edit ? (
            <Form.Item wrapperCol={{ offset: 8 }}>
                <Button type="primary" htmlType="submit" loading={loading}>
                    S???a c???n l??m s??ng
                </Button>
            </Form.Item>
            ) : (
            <Form.Item wrapperCol={{ offset: 8 }}>
                <Button type="primary" htmlType="submit" loading={loading}>
                    Th??m c???n l??m s??ng
                </Button>
            </Form.Item>
            )}
        </Form>
    
    );
};

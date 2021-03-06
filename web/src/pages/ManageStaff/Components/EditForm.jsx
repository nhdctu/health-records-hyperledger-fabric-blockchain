import React, {useState, useEffect} from 'react';
import {Form, Input, DatePicker, Button, Result, Space} from 'antd';
import {RetweetOutlined, EditOutlined} from '@ant-design/icons'
import 'moment/locale/en-au';
import moment from 'moment';
import locale from 'antd/es/date-picker/locale/vi_VN';
import axios from 'axios';
import { DEFAULT_HOST } from '@/host';
import Modal from 'antd/lib/modal/Modal';
import { fetchCurrentUser } from '@/helpers/Auth';

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
        span: 24,
    }
}

const isModified = (currentValue, newValue) => {
    let isModify = false;
    
    Object.keys(newValue).forEach(attr => {
        if(['user_date_of_birth'].includes(attr)){
            if(moment(currentValue[attr]).format('DD-MM-YYYY') !== newValue[attr]){
                isModify = true;
            }
        }
        if(['user_is_deleted'].includes(attr)){
            if(currentValue[attr] !== newValue[attr]){
                isModify = true;
            }
        }
        if(currentValue[attr] !== newValue[attr]) 
        {
            isModify = true;
        }
    })
    return isModify;
}

export default ({ defaultValue, onCancel}) => {
    const [current, setCurrent] = useState(defaultValue);
    const [edit, setEdit] = useState({
        value: {},
        isEditing: false,
    });
    const [success, setSuccess] = useState(false);
    const [posting, setPosting] = useState(false);
    const [form] = Form.useForm();
    const user = fetchCurrentUser();
    const [deleted, setDeleted] = useState(defaultValue.user_is_deleted);
    const config = {
        headers: {
            Authorization: `Bearer ${user.token}`
        }
    }
    useEffect(() => {
        setCurrent({
            ...defaultValue,
            user_date_of_birth: moment(defaultValue.user_date_of_birth, 'DD-MM-YYYY'),
            isConverted: true,
        });
    }, [defaultValue]);

    useEffect(() => {
        if (current.isConverted) form.setFieldsValue(current);
    }, [current, form]);


    const handleFormFinish = async (value) => {
        setPosting(true);
        const url = `${DEFAULT_HOST}/users/${current.user_id}`;
        // alert(deleted);
        const va = value;
        va.user_is_deleted = deleted;
        va.user_date_of_birth = value.user_date_of_birth.format('DD-MM-YYYY');
        if (!isModified(current, va)) return setTimeout(() => setSuccess(true), 1500);
        try {
            const result = await axios.post(url, va, config);
            if (result.data.success) {setPosting(false); setSuccess(true)};
        } catch (error) {
            setPosting(false);
        }
        return "";
    };

    // const verifyUser = async (userId) => {
    //     const url = DEFAULT_HOST + '/users/' + userId+ '/verify';
    //     try {
    //         const result = await axios.put(url, {}, config);
    //         if (result.data.success) return true;
    //         return false
    //     } catch (error) {
    //        return false; 
    //     }
    // }

    return (
        <Form
            autoComplete="off"
            labelAlign="left"
            {...layout}
            onFinish={handleFormFinish}
            form={form}
        >
            <Form.Item name='user_id' label='ID'>
                <Input readOnly disabled={true}></Input>
            </Form.Item>
            <Form.Item name='user_role_name' label='Vai tr??'>
                <Input readOnly disabled={true}></Input>
            </Form.Item>
            <Form.Item
                name="user_fullname"
                label="H??? v?? t??n"
                rules={[{ required: true, message: 'Vui l??ng nh???p t??n' }]}
            >
                <Input placeholder="Nguy???n V??n A ..." disabled={posting || !edit.isEditing}></Input>
            </Form.Item>
            <Form.Item
                name="user_phone"
                label="S??? ??i???n tho???i"
                rules={[
                    { required: true, message: 'Vui l??ng nh???p ?????a s??? ??i???n tho???i' },
                    // {
                    //     validator: async (rule, value) => {
                    //         if (value === current.phoneNumber) return;
                    //         if (!(await validate('phoneNumber', value)))
                    //             throw 'S??? ??i???n tho???i ???? ???????c ????ng k??';
                    //     },
                    // },
                    {
                        pattern: /(03|07|08|09|01[2|6|8|9])+([0-9]{8})\b/,
                        message: 'S??T kh??ng ????ng ?????nh d???ng',
                    },
                ]}
            >
                <Input placeholder="0942...." disabled={posting || !edit.isEditing}></Input>
            </Form.Item>
            <Form.Item
                name="user_email"
                label="Email"
                rules={[
                    { type: 'email', message: '?????a ch??? email kh??ng h???p l???' },
                    { required: true, message: 'Vui l??ng nh???p ?????a ch??? email' },
                    // {
                    //     validator: async (rule, value) => {
                    //         if (value === current.email) return;
                    //         if (!(await validate('email', value))) throw 'Email ???? ???????c ????ng k??';
                    //     },
                    // },
                ]}
            >
                <Input
                    placeholder="abcxyz@gmail.com......"
                    disabled={posting || !edit.isEditing}
                ></Input>
            </Form.Item>
            <Form.Item
                name="user_date_of_birth"
                label="Ng??y sinh"
                rules={[{ required: true, message: 'Vui l??ng nh???p ng??y' }]}
            >
                <DatePicker disabled={posting || !edit.isEditing} locale={locale}></DatePicker>
            </Form.Item>
            <Form.Item
                name="user_identity_card"
                label="S??? CMND"
                rules={[
                    { pattern: /\d{9}\b/, message: 'S??? cmnd kh??ng ????ng' },
                    { required: true, message: 'Vui l??ng nh???p s??? cmnd' },
                    // {
                    //     validator: async (rule, value) => {
                    //         if (value === current.identityCardNumber) return;
                    //         if (!(await validate('identityCardNumber', value)))
                    //             throw 'S??? cmnd n??y ???? ???????c ????ng k??';
                    //     },
                    // },
                ]}
            >
                <Input placeholder="123456789" disabled={posting || !edit.isEditing}></Input>
            </Form.Item>
            <Form.Item
                name="user_job"
                label="Ngh??? nghi???p"
                rules={[{ required: true, message: 'Vui l??ng nh???p ngh??? nghi???p' }]}
            >
                <Input
                    placeholder="B??c s??"
                    disabled={posting || !edit.isEditing}
                ></Input>
            </Form.Item>
            <Form.Item
                name="user_workplace"
                label="N??i l??m vi???c"
                rules={[{ required: true, message: 'Vui l??ng nh???p n??i l??m vi???c' }]}
            >
                <Input disabled={posting || !edit.isEditing}></Input>
            </Form.Item>
            <Form.Item
                name="user_address"
                label="?????a ch???"
                rules={[{ required: true, message: 'Vui l??ng nh???p ?????a ch???' }]}
            >
                <Input
                    placeholder="Ninh Ki???u, C???n Th??"
                    disabled={posting || !edit.isEditing}
                ></Input>
            </Form.Item>
            <Form.Item name="user_is_deleted" label="Tr???ng th??i t??i kho???n:">
                {deleted ? 
                <Button disabled={posting || !edit.isEditing} onClick={() => setDeleted(false)}>??ang kh??a</Button>:
                <Button disabled={posting || !edit.isEditing} onClick={() => setDeleted(true)}>???? k??ch ho???t</Button>}
            </Form.Item>
            <Form.Item {...buttonCol}>
                <Button
                    style={{ float: 'left' }}
                    type="default"
                    htmlType="button"
                    disabled={!edit.isEditing || posting}
                    onClick={() => form.setFieldsValue(current)}
                >
                    <RetweetOutlined />
                    Kh??i ph???c
                </Button>
                <Space style={{ float: 'right' }}>
                    <Button
                        style={{ float: 'right' }}
                        type="default"
                        htmlType="button"
                        disabled={edit.isEditing}
                        onClick={() => setEdit({ ...edit, isEditing: true })}
                    >
                        <EditOutlined />
                        Ch???nh s???a
                    </Button>
                    <Button
                            style={{ float: 'right' }}
                            type="primary"
                            htmlType="submit"
                            loading={posting}
                            disabled={!edit.isEditing}
                        >
                            X??c nh???n
                    </Button>
                </Space>
            </Form.Item>
            <Modal
                visible={success}
                footer={null}
                onCancel={() => {
                    setSuccess(false);
                    onCancel();
                }}
            >
                <Result status="success" title="Ch???nh s???a th??ng tin th??nh c??ng"/>
            </Modal>
        </Form>
    );
};
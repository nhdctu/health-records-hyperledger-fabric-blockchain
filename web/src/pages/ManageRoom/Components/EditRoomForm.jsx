import React, {useState, useEffect} from 'react';
import {Form, Input, Button, Result, Space} from 'antd';
import {RetweetOutlined, EditOutlined} from '@ant-design/icons'
import 'moment/locale/en-au';
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
        if(['room_name'].includes(attr)){
            if(currentValue[attr] !== newValue[attr])
                isModify = true;
            
        }
        if(['room_is_deleted'].includes(attr)){
            if(currentValue[attr] !== newValue[attr])
                isModify = true;
            
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
    const [deleted, setDeleted] = useState(defaultValue.room_is_deleted);
    const config = {
        headers: {
            Authorization: `Bearer ${user.token}`
        }
    }
    const validate1 = async (field, value) => {
        const url = `${DEFAULT_HOST}/admin/validate-department?field=${field}&value=${value}`;
        try {
            const result = await axios.get(url);
            return result.data.valid;
        } catch (error1) {
            return false;
        }
    }; 
    useEffect(() => {
        setCurrent({
            ...defaultValue,
            isConverted: true,
        });
    }, [defaultValue]);

    useEffect(() => {
        if (current.isConverted) form.setFieldsValue(current);
    }, [current, form]);

    const handleFormFinish = async (value) => {
        setPosting(true);
        const url = `${DEFAULT_HOST}/admin/room/${current.room_id}`;
        const va = value
        va.room_is_deleted = deleted;
        if (!isModified(current, va)) return setTimeout(() => setSuccess(true), 1500);
        try {
            const result = await axios.post(url, va, config);
            if (result.data.success) {setPosting(false); setSuccess(true)};
        } catch (error) {
            setPosting(false);
        }
        return "";
    };

    return (
        <Form
            autoComplete="off"
            labelAlign="left"
            {...layout}
            onFinish={handleFormFinish}
            form={form}
        >
            <Form.Item name='room_id' label='ID'>
                <Input readOnly></Input>
            </Form.Item>
            <Form.Item
                name="room_name"
                label="T??n ph??ng"
                rules={[{ required: true, message: 'Vui l??ng nh???p t??n ph??ng' }]}
            >
                <Input placeholder="Khoa ..." disabled={posting || !edit.isEditing}></Input>
            </Form.Item>
            <Form.Item 
                name="room_number"
                label="S??? ph??ng"
                hasFeedback
                rules={[
                    {pattern: /([1-9])\b/,  message: 'Vui l??ng nh???p s???'},
                    { required: true, message: 'Vui l??ng nh???p s??? ph??ng' },
                    
                ]}>
                <Input disabled={posting || !edit.isEditing} placeholder="1"></Input>
            </Form.Item>
            <Form.Item 
                name="room_department_name"
                label="Khoa"
                hasFeedback
                disabled={posting || !edit.isEditing}
                rules={[
                    { required: true, message: 'Vui l??ng nh???p t??n khoa' },
                    {
                        validator: async (rule, value) => {
                            if ((await validate1('department_name', value))) throw  new Error('T??n khoa kh??ng t???n t???i');
                        },
                    },
                    
                ]}>
               <Input disabled={posting || !edit.isEditing} placeholder="Khoa ..."></Input>
            </Form.Item>
            <Form.Item
                name="room_description"
                label="M?? t???"
            >
                <Input
                    placeholder="M?? t???......"
                    disabled={posting || !edit.isEditing}
                ></Input>
            </Form.Item>
            <Form.Item name="room_is_deleted" label="Tr???ng th??i:">
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
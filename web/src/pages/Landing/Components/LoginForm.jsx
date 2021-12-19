import React, {useState } from 'react';
import { Alert, Form, Button, Input} from 'antd';
import axios from 'axios';
import { history } from 'umi';

import {login } from '@/helpers/Auth'

const serverUrl = 'http://localhost:3000/';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [buttonLoading, setButtonLoading] = useState(false);
    const [failed, setFailed] = useState(false);
    const [errormessage, setMessage] = useState();
    // const auth = fetchCurrentUser()

    const handleUsernameInput = (event) => {
        setUsername(event.target.value);
    }
    const handlePasswordInput = (event) => {
        setPassword(event.target.value);
    }
    
    const handleError = (change) => {
        setMessage(change);
    }
    const formFinish = async (values) => {
        setButtonLoading(true);
        let result
        try {
            result = await axios({
                method: 'post',
                url: `${serverUrl}auth/login-staff`,
                data: values,
            });
            if (result.data.success) {

                login(result.data.data.token, result.data.data.user);
                if (result.data.data.user.user_role_name === 'Bác sĩ') history.push('/physician');
                if (result.data.data.user.user_role_name === 'Lễ tân') history.push('/receptionist');
            }
            else {handleError(result.data.data.message); setButtonLoading(false); setFailed(true); }
            
        } catch (error) {
            // console.log(error);
            setButtonLoading(false);
            setFailed(true);
        }
    }
  
    return (
        <Form
            name="basic"
            initialValues={{remember: true,}}
            style={{border: true}}
            onFinish={formFinish}
            labelCol={{span: 6}}
            wrapperCol={{span: 18}}
        >
            <Form.Item
                label="Email"
                name="email"
                rules={[
                    {
                        required: true,
                        message: 'Email không được để trống',
                    },
                ]}
            >
                <Input value={username} onChange={handleUsernameInput} />
            </Form.Item>

            <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[
                    {
                        required: true,
                        message: 'Mật khẩu không được để trống',
                    },
                ]}
            >
                <Input.Password value={password} onChange={handlePasswordInput} />
            </Form.Item>

            <Form.Item wrapperCol={{offset: 6, span: 16}}>
                <Button 
                    type="primary"
                    style={{height:'35', width: '15  0px', marginRight: 0}}
                    htmlType='submit'
                    loading={buttonLoading}
                >
                    Đăng nhập
                </Button>
            </Form.Item>
            {failed ? <Alert type='error'  message = {errormessage}></Alert> : null}
        </Form>
    )
  }

  
export default LoginForm;
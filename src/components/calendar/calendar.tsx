import { useState, ChangeEvent, FunctionComponent, useCallback, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import apiService from "../../services/axios.sevices";
import Loading from "../spinner/spinner";
import { toast } from "react-toastify";
import { useUserContext, useUserToggleContext } from "../../provider/userProvider";
import { useHistory } from "react-router-dom";

export const Calendar: FunctionComponent = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const history = useHistory()
  
  const user = useUserContext()
  const setUser = useUserToggleContext()
  
    useEffect(() => {
      !user && history.push('login')
    }, [history, user])

  const clearState = () => {
    setSelectedDate(new Date())
    setPhoneNumber('')
  }
  const handleLogout = () => {
    setUser(null)
    history.push('login')
  };


  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  }

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const data = { date: selectedDate, phoneNumber };

      const headers = {
        Authorization: `Bearer ${user.accessToken}`,
        'Content-Type': 'application/json',
      };
      const response = (await apiService.post('/reservations', data, { headers }));

      if (response.data) {
        toast(`Successful reservation!`)
      } else {
        toast('reservation error');
      }
    } catch (error) {
      toast('System error');
    } finally {
      setLoading(false);
      clearState()
    }
  };

  return (
    <div className="d-flex row">
      <h2>Select a date to visit</h2>
      <Form className="col-12" >
        <Form.Group controlId="formPhone" className="mb-3">
          <Form.Control
            type="date"
            value={selectedDate.toISOString().split('T')[0]}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleDateChange(new Date(e.target.value))
            }
            className="my-3"
          />
          <Form.Control
            type="text"
            placeholder="Enter phone number"
            value={phoneNumber}
            onChange={handlePhoneChange}
          />
        </Form.Group>
        <Button
          variant="primary"
          className="my-3 col-12"
          size="lg"
          disabled={loading}
          onClick={handleSubmit}
        >
          {loading ? <Loading /> : 'Reserve'}
        </Button>
        <Button variant="warning" onClick={handleLogout} className='col-12' disabled={loading}>
          Logout
        </Button>
      </Form>
    </div>
  );
};

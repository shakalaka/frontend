import * as React from 'react';
import 'sass/app.scss';
import Modal from "react-modal";

const customStyles = {
    content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)'
    }
};
Modal.setAppElement('#root');


const API = 'http://localhost:8080/api/v1/';

class Tasks extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            content: {
                data: [],
                current_page: 1,
            },
            isLoading: false,
            query: '',
            modalIsOpen: false,
            isModalLoading: false,
            modalData: ''
        };

        this.handleClickPaginate = this.handleClickPaginate.bind(this);

        this.openModal = this.openModal.bind(this);
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    openModal(event) {
        this.setState({ isModalLoading: true });
        fetch(API + 'task/' + event.currentTarget.dataset.popup)
            .then(response => response.json())
            .then(data => this.setState({
                modalData: data,
                modalIsOpen: true,
                isModalLoading: false
            }));
    }

    afterOpenModal() {
        this.subtitle.style.color = '#f00';
    }

    closeModal() {
        this.setState({modalIsOpen: false});
    }


    handleClickPaginate(event) {
        this.setState({ isLoading: true });

        fetch(API + 'task?query=' + this.state.query + '&page=' + event.target.id)
            .then(response => response.json())
            .then(data => this.setState({
                content: data,
                isLoading: false
            }));
    }

    componentDidMount() {
        this.setState({ isLoading: true });

        fetch(API + 'task')
            .then(response => response.json())
            .then(data => this.setState({
                content: data,
                isLoading: false
            }));
    }

    render() {
        const { content, isLoading } = this.state;

        if (isLoading) {
            return <p>Загрузка ...</p>;
        }

        const pageNumbers = [];
        const minPage = 1;
        const maxPage = content.last_page;

        pageNumbers.push(content.current_page);
        for (let i = 1; i <= 5; i++) {
            let max = content.current_page + i;
            let min = content.current_page - i;

            if (max < maxPage) {
                pageNumbers.push(max);
            }

            if (min > minPage) {
                pageNumbers.unshift(min);
            }
        }

        if (content.current_page !== maxPage) {
            pageNumbers.push(maxPage);
        }

        if (content.current_page !== minPage) {
            pageNumbers.unshift(minPage);
        }

        const renderPageNumbers = pageNumbers.map(number => {
            return (
                <li
                    className={ number === content.current_page ? 'active page-item': 'page-item' }
                    key={number}>
                    <span className="page-link"
                          id={number}
                          onClick={this.handleClickPaginate}
                    >{number}</span>
                </li>
            );
        });

        return (
            <div>

                <table className="table">
                    <thead>
                    <tr>
                        <th>Идентификатор</th>
                        <th>Название</th>
                        <th>Дата</th>
                    </tr>
                    </thead>
                    <tbody>
                    {content.data.map(item =>
                        <tr
                            data-popup={item.id}
                            onClick={this.openModal}
                            key={item.id}>
                          <th>{item.id}</th>
                          <td>{item.title}</td>
                          <td>{item.date}</td>
                        </tr>
                    )}
                    </tbody>
                </table>

                <nav aria-label="Page navigation example">
                    <ul className="pagination">
                    {renderPageNumbers}
                    </ul>
                </nav>
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onAfterOpen={this.afterOpenModal}
                    onRequestClose={this.closeModal}
                    style={customStyles}
                    contentLabel="Example Modal"
                >

                    <h2 ref={subtitle => this.subtitle = subtitle}>Информация о задаче № {this.state.modalData.id}</h2>
                    <div className="form-group row">
                        <label htmlFor="inputTitle" className="col-sm-4 col-form-label">Заголовок</label>
                        <div className="col-sm-8">
                            <input type="text" className="form-control" id="inputTitle"
                                placeholder="Заголовок" value={this.state.modalData.title}/>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="inputDate" className="col-sm-4 col-form-label">Дата выполнения</label>
                        <div className="col-sm-8">
                            <input type="text" className="form-control" id="inputDate"
                                   placeholder="Дата выполнения" value={this.state.modalData.date}/>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="inputAuthor" className="col-sm-4 col-form-label">Автор</label>
                        <div className="col-sm-8">
                            <input type="text" className="form-control" id="inputAuthor"
                                   placeholder="Автор" value={this.state.modalData.author}/>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="inputStatus" className="col-sm-4 col-form-label">Статус</label>
                        <div className="col-sm-8">
                            <input type="text" className="form-control" id="inputStatus"
                                   placeholder="Статус" value={this.state.modalData.status}/>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="inputDesc" className="col-sm-4 col-form-label">Описание</label>
                        <div className="col-sm-8">
                            <textarea className="form-control" id="inputDesc"
                                      placeholder="Описание">{this.state.modalData.description}</textarea>
                        </div>
                    </div>

                    <button class="btn-block" onClick={this.closeModal}>Закрыть</button>
                </Modal>
            </div>
        );
    }
}

export default Tasks;

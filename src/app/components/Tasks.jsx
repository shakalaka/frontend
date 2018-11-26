import * as React from 'react';
import 'sass/app.scss';

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
            query: ''
        };

        this.handleClickPaginate = this.handleClickPaginate.bind(this);
        this.handleClickPopup = this.handleClickPopup.bind(this);
    }

    handleClickPopup(event) {
        fetch(API + 'task/' + event.currentTarget.dataset.popup)
            .then(response => response.json());
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
                            onClick={this.handleClickPopup}
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
            </div>
        );
    }
}

export default Tasks;

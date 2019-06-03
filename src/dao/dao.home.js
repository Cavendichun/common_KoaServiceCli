class HomeDao {
    constructor(props) {
        this.props = props;
    }
    //示例
    async example() {
        // let res = await this.props.Query(`select * from user_info`);
        return 'example';
    }
}

export default HomeDao;
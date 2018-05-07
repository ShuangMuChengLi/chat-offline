<template>
    <div class="wrapper">
        <el-table
            @row-click="goto"
            :data="tableData">
            <el-table-column
                label="姓名">
                <template slot-scope="scope">
                    {{ scope.row.name }}
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import io from "socket.io-client";

    const queryString = require("query-string");
    const util = require("../../js/util/util");
    const conf = require("../../config/conf");
    const usersMap = require("../../../db/usersMap");
    export default {
        data() {
            return {
                tableData: usersMap
            }
        },
        watch: {},
        computed: {

        },
        created: function () {
        },
        mounted: function () {
        },
        methods: {
            goto(row){
                this.$router.push("/" + row.id)
            }

        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
    @import "../../css/list";
</style>

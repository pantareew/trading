// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Trade {
    struct Transaction {
        int256 block;
        address from;
        address to;
        string hash;
        string date;
        int256 status;
    }

    Transaction[] public transactions;

    function storeTransaction(
        int256 _block,
        address _from,
        address _to,
        string memory _hash,
        string memory _date,
        int256 _status
    ) public {
        transactions.push(
            Transaction({
                block: _block,
                from: _from,
                to: _to,
                hash: _hash,
                date: _date,
                status: _status
            })
        );
    }

    function getTransactions() public view returns (Transaction[] memory) {
        return transactions;
    }
}

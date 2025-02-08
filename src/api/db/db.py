from tinydb import TinyDB, Query, database


class DataBase:
    def __init__(self):
        self.db = TinyDB('db.json')
        self.users = self.create_table('users')
        self.products = self.create_table('products')
        self.cart = self.create_table('cart')
        self.query = Query()

    def insert(self, table, data_dict):
        if type(table) == database.Table:
            table.insert(data_dict)
        else:
            self.db.table(table).insert(data_dict)

    def create_table(self, table_name):
        return self.db.table(table_name)

    def search(self, table, query):
        if type(table) == database.Table:
            return table.search(query)
        else:
            return self.db.table(table).search(query)

    def update(self, table, update, query):
        if type(table) == database.Table:
            table.update(update, query)
        else:
            self.db.table(table).update(update, query)

    def remove(self, table, query):
        if type(table) == database.Table:
            table.remove(query)
        else:
            self.db.table(table).remove(query)

        return self.db.remove(query)

    def purge_table(self, table):
        if type(table) == database.Table:
            table.truncate()
        else:
            self.db.table(table).purge()

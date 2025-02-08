FROM python:3.7.4-buster

# cp source code
COPY . /opt/store/api

# install dependencies
WORKDIR /opt/store/api
RUN pip install --upgrade pip; pip install -r requirements.txt

CMD python api.py

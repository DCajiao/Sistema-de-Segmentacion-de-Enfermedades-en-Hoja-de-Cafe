FROM python:3.13-slim

WORKDIR /app

# Install uv via pip
RUN pip install --no-cache-dir uv

# Just copy the lock file to leverage Docker cache
COPY pyproject.toml ./

# Install defined dependencies in pyproject.toml
RUN uv pip install -r pyproject.toml --system

# Copy the rest of the project
COPY . ./
EXPOSE 8000
CMD ["python", "main.py"]
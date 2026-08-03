import { useState } from 'react';
import {
  useLearningItems,
  useAddLearningItem,
  useUpdateLearningItem,
  useDeleteLearningItem,
} from '../../hooks/useLearning';

import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';

const STATUS_FILTER_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'not-started', label: 'Not Started' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

const TYPE_OPTIONS = [
  { value: 'course', label: 'Course' },
  { value: 'article', label: 'Article' },
  { value: 'video', label: 'Video' },
  { value: 'book', label: 'Book' },
  { value: 'project', label: 'Project' },
  { value: 'other', label: 'Other' },
];

const statusColors = {
  'not-started': 'bg-gray-100 text-gray-700',
  'in-progress': 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
};

const Learning = () => {
  const [statusFilter, setStatusFilter] = useState('');

  const { data, isLoading, error } = useLearningItems(statusFilter);

  const addMutation = useAddLearningItem();
  const updateMutation = useUpdateLearningItem();
  const deleteMutation = useDeleteLearningItem();

  const [form, setForm] = useState({
    title: '',
    type: 'course',
    platform: '',
  });


  if (isLoading) {
    return <p>Loading learning items...</p>;
  }

  if (!data) {
    return (
      <div className="text-center mt-10">
        <p>No learning data available.</p>
      </div>
    );
  }


  // FIXED HERE
  const items = data.items || [];


  const handleSubmit = (e) => {
    e.preventDefault();

    addMutation.mutate(form, {
      onSuccess: () => {
        setForm({
          title: '',
          type: 'course',
          platform: '',
        });
      },
    });
  };


  const handleProgressChange = (id, progressPercent) => {
    updateMutation.mutate({
      id,
      data: {
        progressPercent: Number(progressPercent),
      },
    });
  };


  return (
    <div>

      <h1 className="text-2xl font-bold mb-6">
        Learning Progress
      </h1>


      <Card className="mb-6">

        <form
          onSubmit={handleSubmit}
          className="flex flex-wrap items-end gap-4"
        >

          <div className="flex-1 min-w-[180px]">
            <Input
              label="Title"
              value={form.title}
              onChange={(e) =>
                setForm({
                  ...form,
                  title: e.target.value,
                })
              }
              required
            />
          </div>


          <div className="w-40">
            <Select
              label="Type"
              options={TYPE_OPTIONS}
              value={form.type}
              onChange={(e) =>
                setForm({
                  ...form,
                  type: e.target.value,
                })
              }
            />
          </div>


          <div className="w-40">
            <Input
              label="Platform"
              value={form.platform}
              onChange={(e) =>
                setForm({
                  ...form,
                  platform: e.target.value,
                })
              }
              placeholder="e.g. Udemy"
            />
          </div>


          <Button
            type="submit"
            isLoading={addMutation.isPending}
            className="mb-4"
          >
            Add Item
          </Button>

        </form>

      </Card>



      <div className="mb-4 w-56">

        <Select
          label="Filter by status"
          options={STATUS_FILTER_OPTIONS}
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
        />

      </div>



      {items.length === 0 ? (

        <p className="text-gray-500">
          No learning items found.
        </p>

      ) : (

        <div className="space-y-3">

          {items.map((item) => (

            <Card key={item._id}>

              <div className="flex justify-between items-start">

                <div>

                  <h3 className="font-semibold">
                    {item.title}
                  </h3>

                  <p className="text-sm text-gray-500">

                    {item.type}

                    {item.platform &&
                      ` · ${item.platform}`}

                    {item.relatedSkill &&
                      ` · Linked to ${item.relatedSkill.name}`}

                  </p>

                </div>


                <span
                  className={`text-xs px-2 py-1 rounded-full ${statusColors[item.status]}`}
                >
                  {item.status}
                </span>

              </div>



              <div className="mt-3 flex items-center gap-3">


                <input
                  type="range"
                  min="0"
                  max="100"
                  value={item.progressPercent}
                  onChange={(e) =>
                    handleProgressChange(
                      item._id,
                      e.target.value
                    )
                  }
                  className="flex-1"
                />


                <span className="text-sm text-gray-600 w-12">
                  {item.progressPercent}%
                </span>


                <button
                  onClick={() =>
                    deleteMutation.mutate(item._id)
                  }
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Delete
                </button>


              </div>


            </Card>

          ))}

        </div>

      )}

    </div>
  );
};


export default Learning;